> This repository is for demonstration purposes of how it can be implemented in Angular and is not maintaned. Please fork and maintain your own version of this repository.

# ng2-radio-group

Ultimate set of select components that you ever need. All with angular2, no jquery.
Checkbox group and radio group control for your angular2 applications. Does not depend of jquery.
Please star a project if you liked it, or create an issue if you have problems with it.

![angular 2 radio groups and checkbox groups](https://raw.githubusercontent.com/pleerock/ng2-radio-group/master/resources/radio-group-example.png)

## Installation

1. Install npm module:

    `npm install ng2-radio-group --save`

2. If you are using system.js you may want to add this into `map` and `package` config:

    ```json
    {
        "map": {
            "ng2-radio-group": "node_modules/ng2-radio-group"
        },
        "packages": {
            "ng2-radio-group": { "main": "index.js", "defaultExtension": "js" }
        }
    }
    ```

## Simple checkboxes and radio boxes

If you need a simple checkbox for your variable:

```html
<input type="checkbox" [(ngModel)]="rememberMe" [value]="true" [uncheckedValue]="false"> remember me?<br/>
```

* `ngModel` is a model you are trying to change (rememberMe is a boolean variable in your component)
* `value` is a value that should be written to the model when checkbox is checked. Default is **true**.
* `uncheckedValue` is a value that should be written to the model when checkbox is unchecked. Default is **false**.
* `required` you can set it to required, and you can use it with forms

If your model is an array and you want to push multiple items into it, you can use it with this component:

```html
<input type="checkbox" [(ngModel)]="orderBy" value="rating"> Rating<br/>
<input type="checkbox" [(ngModel)]="orderBy" value="date"> Date<br/>
<input type="checkbox" [(ngModel)]="orderBy" value="watches"> Watch count<br/>
<input type="checkbox" [(ngModel)]="orderBy" value="comments"> Comment count<br/>
```

Don't forget to initialize your `orderBy` array.


If you need to select only one item from the multiple options, you need a radio boxes:

```html
<input type="radio" [(ngModel)]="sortBy" value="rating"> Rating<br/>
<input type="radio" [(ngModel)]="sortBy" value="date"> Date<br/>
<input type="radio" [(ngModel)]="sortBy" value="watches"> Watch count<br/>
<input type="radio" [(ngModel)]="sortBy" value="comments"> Comment count<br/>
```

## Checkbox and Radio groups

To simplify this selection you can use checkbox and radio groups:

```html
<radio-group [(ngModel)]="sortBy" [required]="true">
    <input type="radio" value="rating"> Rating<br/>
    <input type="radio" value="date"> Date<br/>
    <input type="radio" value="watches"> Watch count<br/>
    <input type="radio" value="comments"> Comment count<br/>
</radio-group>

<checkbox-group [(ngModel)]="orderBy">
    <input type="checkbox" value="rating"> Rating<br/>
    <input type="checkbox" value="date"> Date<br/>
    <input type="checkbox" value="watches"> Watch count<br/>
    <input type="checkbox" value="comments"> Comment count<br/>
</checkbox-group>
```

If you want to go deeper and make better (but less customizable) radio groups, then use radio-groups in composition
with radio-items:

```html
<radio-group [(ngModel)]="sortBy" [disabled]="false">
    <radio-item value="rating">Rating</radio-item>
    <radio-item value="date">Date</radio-item>
    <radio-item value="watches">Watch count</radio-item>
    <radio-item value="comments">Comment count</radio-item>
</radio-group>

<checkbox-group [(ngModel)]="orderBy" [required]="true">
    <checkbox-item value="rating">Rating</checkbox-item>
    <checkbox-item value="date">Date</checkbox-item>
    <checkbox-item value="watches">Watch count</checkbox-item>
    <checkbox-item value="comments">Comment count</checkbox-item>
</checkbox-group>
```

Last method allows you to click on labels and you click will treat like you clicked on a checkbox itself.

## Select items component

tbd

## Select dropdown component

tbd

## Autocomplete component

tbd

## Select tags component

tbd

## Sample

Complete example of usage:

```typescript
import {Component} from "@angular/core";
import {RADIO_GROUP_DIRECTIVES} from "ng2-radio-group";

@Component({
    selector: "app",
    template: `

    <h4>Is something enabled: (non-multiple checkbox)</h4>
    <input type="checkbox" [(ngModel)]="isSomethingEnabled"/>
    <i (click)="click()">isSomethingEnabled value:</i> <b>{{ isSomethingEnabled }}</b><br/><br/>

    <h4>Order by: (multiple check boxes)</h4>
    <input type="checkbox" [(ngModel)]="orderBy" value="rating"> Rating<br/>
    <input type="checkbox" [(ngModel)]="orderBy" value="date"> Date<br/>
    <input type="checkbox" [(ngModel)]="orderBy" value="watches"> Watch count<br/>
    <input type="checkbox" [(ngModel)]="orderBy" value="comments"> Comment count<br/>

    <i>selected items:</i> <b><span *ngFor="let order of orderBy">{{ order }} </span></b><br/><br/>


    <h4>Sort by: (simple radio boxes)</h4>
    <input type="radio" [(ngModel)]="sortWithoutGroup" value="rating"> Rating<br/>
    <input type="radio" [(ngModel)]="sortWithoutGroup" value="date"> Date<br/>
    <input type="radio" [(ngModel)]="sortWithoutGroup" value="watches"> Watch count<br/>
    <input type="radio" [(ngModel)]="sortWithoutGroup" value="comments"> Comment count<br/>

    <i>selected item:</i> <b>{{ sortWithoutGroup }}</b><br/><br/>


    <h4>Sort by: (radio boxes wrapped in the group)</h4>
    <radio-group [(ngModel)]="sortBy">
        <input type="radio" value="rating"> Rating<br/>
        <input type="radio" value="date"> Date<br/>
        <input type="radio" value="watches"> Watch count<br/>
        <input type="radio" value="comments"> Comment count<br/>
    </radio-group>

    <i>selected item:</i> <b>{{ sortBy }}</b><br/><br/>


    <h4>Order by: (check boxes wrapped in the group)</h4>
    <checkbox-group [(ngModel)]="orderBy">
        <input type="checkbox" value="rating"> Rating<br/>
        <input type="checkbox" value="date"> Date<br/>
        <input type="checkbox" value="watches"> Watch count<br/>
        <input type="checkbox" value="comments"> Comment count<br/>
    </checkbox-group>

    <i>selected items:</i> <b><span *ngFor="let order of orderBy">{{ order }} </span></b><br/><br/>


    <h4>Sort by: (check boxes in group, less flexible, but simpler and the whole component is clickable)</h4>
    <radio-group [(ngModel)]="sortBy">
        <radio-item value="rating">Rating</radio-item>
        <radio-item value="date">Date</radio-item>
        <radio-item value="watches">Watch count</radio-item>
        <radio-item value="comments">Comment count</radio-item>
    </radio-group>

    <i>selected item:</i> <b>{{ sortBy }}</b><br/><br/>


    <h4>Order by: (radio boxes in group, less flexible, but simpler and the whole component is clickable)</h4>
    <checkbox-group [(ngModel)]="orderBy">
        <checkbox-item value="rating">Rating</checkbox-item>
        <checkbox-item value="date">Date</checkbox-item>
        <checkbox-item value="watches">Watch count</checkbox-item>
        <checkbox-item value="comments">Comment count</checkbox-item>
    </checkbox-group>

    <i>selected items:</i> <b><span *ngFor="let order of orderBy">{{ order }} </span></b><br/><br/>


    <h4>Example with form:</h4>

    <form>
        <radio-group ngControl="sortByControl" #sortByRadioGroup="ngForm" [(ngModel)]="sortBy" [required]="true">
            <input type="radio" value=""> Not selected<br/>
            <input type="radio" value="rating"> Rating<br/>
            <input type="radio" value="date"> Date<br/>
            <input type="radio" value="watches"> Watch count<br/>
            <input type="radio" value="comments"> Comment count<br/>
        </radio-group>
        <div [hidden]="sortByRadioGroup.valid || sortByRadioGroup.pristine" class="alert alert-danger">
            Sort by is required
        </div>
        <br/>
        <checkbox-group ngControl="orderByControl" #orderByCheckboxGroup="ngForm" [(ngModel)]="orderBy" [required]="true">
            <checkbox-item value="rating">Rating</checkbox-item>
            <checkbox-item value="date">Date</checkbox-item>
            <checkbox-item value="watches">Watch count</checkbox-item>
            <checkbox-item value="comments">Comment count</checkbox-item>
        </checkbox-group>
        <div [hidden]="orderByCheckboxGroup.valid || orderByCheckboxGroup.pristine" class="alert alert-danger">
            Order by is required
        </div>
    </form>

    `,
    directives: [RADIO_GROUP_DIRECTIVES]
})
export class App {

    rememberMe: boolean = false;
    sortBy: string = "date";
    orderBy: string[] = ["rating", "comments"];

}
```

Take a look on samples in [./sample](https://github.com/pleerock/ng2-radio-group/tree/master/sample) for more examples of
usages.

## Release notes

**0.0.5**

* `[(model)]` now should be `[(ngModel)]`
* component now can be used with forms and validation can be applied (like `required`)
* `check-box` and `radio-box` has been removed, now you simply need to make your input as checkbox or radio:
`<input type="checkbox">` or `<input type="radio">`
