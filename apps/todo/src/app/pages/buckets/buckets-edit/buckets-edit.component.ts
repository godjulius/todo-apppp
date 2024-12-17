import {Component, DestroyRef, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {BucketsService} from "../../../shared/services/buckets.service";
import {finalize} from "rxjs";
import {BaseComponent} from "../../../core/base.component";

@Component({
    selector: 'app-buckets-edit',
    standalone: true,
    imports: [CommonModule, MatSlideToggleModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
    templateUrl: './buckets-edit.component.html',
    styleUrl: './buckets-edit.component.scss',
})
export class BucketsEditComponent extends BaseComponent{
    isPublic = true;
    title = '';
    isCreate = false;
    matData = inject(MAT_DIALOG_DATA);
    bucketsService = inject(BucketsService);
    dialogRef = inject(MatDialogRef<BucketsEditComponent>)
    constructor() {
        super()
        if (this.matData) {
            this.isPublic = this.matData.public;
            this.title = this.matData.title;
        } else {
            this.isCreate = true
        }
    }

    updateBucket() {
        const updateTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' });
        const newBucket = {
            ...this.matData,
            title: this.title,
            public: this.isPublic,
            updatedAt: updateTime
        }
        this.loadingService.startLoading()
        const updateSubs = this.bucketsService.patchBucket(this.matData.id, newBucket)
            .pipe(
                finalize(() => {
                    this.loadingService.stopLoading()
                })
            )
            .subscribe(
            (res: any) => {
                console.log(res);
                this.dialogRef.close(true);
            }
        )
            this.destroyRef.onDestroy(() => {
                updateSubs.unsubscribe();
            })
    }

    createBucket() {
        const newBucket = {
            title: this.title,
            public: this.isPublic,
        }
        this.loadingService.startLoading()
        const createSubs = this.bucketsService.createBucket(newBucket)
            .pipe(
                finalize(() => {
                    this.loadingService.stopLoading()
                })
            )
            .subscribe(
            (res: any) => {
                console.log(res);
                this.dialogRef.close(true);
            }
        )
        this.destroyRef.onDestroy(() => {
            createSubs.unsubscribe();
        })
    }

    handleDeleteBucket() {
        this.loadingService.startLoading()
        const deleteSubs = this.bucketsService.deleteBucket(this.matData.id)
            .pipe(
                finalize(() => {
                    this.loadingService.stopLoading()
                })
            )
            .subscribe(
            (res: any) => {
                console.log(res);
                this.dialogRef.close(true);
            }
        )
        this.destroyRef.onDestroy(() => {
            deleteSubs.unsubscribe();
        })
    }
}