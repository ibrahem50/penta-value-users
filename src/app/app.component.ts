import { Component, OnInit } from "@angular/core";
import { concatMap, finalize, switchMap, tap } from "rxjs/operators";

import { AngularFireStorage } from "@angular/fire/storage";
import { concat } from "rxjs";

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
      this.loadImageMetadata(res.items);
    });
  }

  loadImageMetadata(item: any) {
    item.map((item, index) => {
      return this.storage
        .ref(item.name)
        .getMetadata()
        .pipe(
          tap((res) => {
            this.filelist.push(res);
            this.filelist.sort((a, b) => {
              const timeA = new Date(a.timeCreated).getTime();
              const timeB = new Date(b.timeCreated).getTime();
              return timeA - timeB;
            });
          }),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe(() => {
          if (index === this.numberOfImages - 1) this.setLast();
        });
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
      this.lastImage = res;
      console.log(this.lastImage);
    });
  }
}
