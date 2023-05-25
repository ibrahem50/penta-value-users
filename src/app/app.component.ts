import { Component, OnInit } from "@angular/core";

import { AngularFireDatabase } from "@angular/fire/database";
import { AngularFireStorage } from "@angular/fire/storage";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  filelist: any[] = [];
  lastImage;
  lastItem;
  type = "";
  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) {}
  ngOnInit(): void {
    const ref = this.storage.ref("/");
    let myurlsubscription = ref.listAll().subscribe((data) => {
      for (let i = 0; i < data.items.length; i++) {
        let newref = this.storage.ref(data.items[i].name);
        newref.getMetadata().subscribe((res) => {
          this.filelist.push(res);
          if (i == data.items.length - 1) {
            // this.filelist.sort(
            //   (a: any, b: any) =>
            //     new Date(a.timeCreated).getDay() -
            //     new Date(b.timeCreated).getDay()
            // );
            this.setLast(res);
          }
        });
      }
    });
  }
  downloadLastImage(data) {
    let newref = this.storage.ref(data.name);
    newref.getDownloadURL().subscribe((res) => {
      window.open(res, "_blank");
    });
  }
  setLast(data) {
    let newref = this.storage.ref(data.name);
    this.type = data.fullPath;
    newref.getDownloadURL().subscribe((res) => {
      this.lastImage = res;
    });
  }
}
