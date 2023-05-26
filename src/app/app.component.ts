import { Component, OnInit } from "@angular/core";
import { concatMap, finalize, switchMap, tap } from "rxjs/operators";

import { AngularFireStorage } from "@angular/fire/storage";
import { forkJoin } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  numberOfImages: number = 0;
  filelist: any[] = [];
  lastImage: any;
  type: string = "";
  isLoading: boolean = false;

  constructor(private storage: AngularFireStorage) {}

  ngOnInit() {
    this.loadImages();
  }

  loadImages() {
    this.isLoading = true;
    const ref = this.storage.ref("/");
    ref.listAll().subscribe((res) => {
      this.numberOfImages = res.items.length;
      const observables = this.loadImageMetadata(res.items);
      forkJoin(observables).subscribe({
        next: () => {
          this.filelist.sort((a, b) => {
            const timeA = new Date(a.updated).getTime();
            const timeB = new Date(b.updated).getTime();
            return timeA - timeB;
          });
          this.setLast();
        },
      });
    });
  }

  loadImageMetadata(items: any[]) {
    return items.map((item) => {
      this.isLoading = true;
      return this.storage
        .ref(item.name)
        .getMetadata()
        .pipe(
          tap((res) => {
            this.filelist.push(res);
          })
        );
    });
  }

  downloadLastImage(data) {
    let newref = this.storage.ref(data.name);
    newref.getDownloadURL().subscribe((res) => {
      window.open(res, "_blank");
    });
  }

  setLast() {
    const lastFile = this.filelist[this.filelist.length - 1];
    let newref = this.storage.ref(lastFile.name);
    this.type = lastFile.fullPath;
    newref.getDownloadURL().subscribe((res) => {
      this.isLoading = false;
      this.lastImage = res;
    });
  }
}
