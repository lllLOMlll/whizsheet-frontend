import { Component, input } from '@angular/core';
import { Field } from '@angular/forms/signals'; 
import { FormsModule } from '@angular/forms';   

@Component({
  selector: 'app-item-section',
  standalone: true,
  imports: [Field, FormsModule], 
  templateUrl: './item-section.html',
  styleUrl: './item-section.css',
})
export class ItemSectionComponent {
  form = input.required<any>();
  rarityOptions = input.required<number[]>();
  itemRarityType = input.required<any>();
}