import { Component, OnInit } from "@angular/core";

import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  list = this.store
    .collection("Users")
    .valueChanges({ idField: "id" }) as Observable<any[]>;
  constructor(private store: AngularFirestore) {}
  ngOnInit() {
    // Get the data from the Firebase Database
    // this.db.database.ref("users").on("value", (snapshot) => {
    //   console.log(snapshot.val());
    // });
    this.list.subscribe((res) => {
      console.log(res);
    });
    // this.store.s
  }
}
