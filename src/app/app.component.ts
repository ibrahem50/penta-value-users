import { Component, OnInit } from "@angular/core";

import { AngularFireDatabase } from "@angular/fire/database";
import { AngularFireStorage } from "@angular/fire/storage";
import { AngularFirestore } from "@angular/fire/firestore";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  private basePath = "/uploads";

  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) {}
  ngOnInit(): void {
    // this.db
    //   .list(this.basePath, (ref) => ref.limitToLast(1000))
    //   .snapshotChanges()
    //   .subscribe((res) => {
    //     console.log(res);
    //   });
    this.storage
      .ref("/")
      .listAll()
      .subscribe((res) => {
        console.log(res);
      });
  }
}
