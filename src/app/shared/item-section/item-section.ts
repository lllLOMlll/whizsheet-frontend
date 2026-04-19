import { Component, input } from '@angular/core';
import { Field } from '@angular/forms/signals'; 
import { FormsModule } from '@angular/forms';   
import { ItemRarityType } from '../../core/models/item';
import { getEnumOptions } from '../../core/utils/enum-util';

@Component({
  selector: 'app-item-section',
  standalone: true,
  imports: [Field, FormsModule], 
  templateUrl: './item-section.html',
  styleUrl: './item-section.css',
})
export class ItemSectionComponent {
  form = input.required<any>();
  
  protected readonly rarityOptions = getEnumOptions<ItemRarityType>(ItemRarityType);
  protected readonly itemRarityType = ItemRarityType;
}