import { Component, Input, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
    animations: [
        trigger('slideAnimation', [
            transition('void => *', [
                style({transform: 'translateX(100%)'}),
                animate('300ms ease-in-out')
            ]),
            transition('* => void', [
                animate('300ms ease-in-out', style({transform: 'translateX(-100%)'}))
            ])
        ])
    ]
})
export class CarouselComponent implements OnInit {

    @Input() images: string[] = [];
    activeIndex = 0;

    ngOnInit(): void {
        console.log(this.images);
    }

    nextSlide(): void {
        if (this.images.length <= 1) {
            return;
        }

        if (this.activeIndex < this.images.length - 1) {
            this.activeIndex++;
        } else {
            this.activeIndex = 0;
        }
    }

    prevSlide(): void {
        if (this.images.length <= 1) {
            return;
        }

        if (this.activeIndex > 0) {
            this.activeIndex--;
        } else {
            this.activeIndex = this.images.length - 1;
        }
    }
}
