import { Component, OnInit } from "@angular/core";
import { concatMap, finalize, switchMap } from "rxjs/operators";

import { AngularFireStorage } from "@angular/fire/storage";
import { concat } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  filelist: any[] = [];
  lastImage: any;
  type: string = "";
  isLoading: boolean = false;

  constructor(private storage: AngularFireStorage) {}

  ngOnInit() {
    this.loadImagesSequentially();
  }

  loadImagesSequentially() {
    this.isLoading = true;
    const ref = this.storage.ref("/");
    ref
      .listAll()
      .pipe(
        concatMap((data) => {
          const observables = data.items.map((item) => {
            return this.loadImageMetadata(item);
          });
          return concat(...observables);
        }),
        finalize(() => {
          this.isLoading = false;
          this.setLast();
        })
      )
      .subscribe((res) => {
        this.filelist.push(res);
      });
  }

  loadImageMetadata(item: any) {
    return this.storage.ref(item.name).getMetadata();
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
    });
  }
}
