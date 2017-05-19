import {
    Component,
    Input,
    ViewEncapsulation,
    OnInit,
    ViewChild,
    ElementRef,
    ContentChild,
    QueryList,
    ContentChildren,
    Directive,
    Optional, EventEmitter, Output
} from "@angular/core";
import {NG_VALIDATORS, NG_VALUE_ACCESSOR} from "@angular/forms";
import {SelectItems} from "./SelectItems";
import {Observable} from "rxjs/Observable";
import {WidthCalculator} from "./WidthCalculator";
import {SelectValidator} from "./SelectValidator";
import {SelectValueAccessor} from "./SelectValueAccessor";
import {Utils} from "./Utils";
import {ItemTemplate} from "./ItemTemplate";
import {SelectControlsOptions} from "./SelectControlsOptions";

@Directive({
    selector: "select-tags-dropdown-template"
})
export class SelectTagsDropdownTemplate {

    @ContentChildren(ItemTemplate)
    itemTemplates: QueryList<ItemTemplate>;

}

@Directive({
    selector: "select-tags-box-template"
})
export class SelectTagsBoxTemplate {

    @ContentChildren(ItemTemplate)
    itemTemplates: QueryList<ItemTemplate>;

}

@Component({
    selector: "select-tags",
    template: `
<div class="select-tags"
     [class.disabled]="disabled"
     [class.readonly]="readonly">
    <div class="select-tags-dropdown dropdown" dropdown [dropdownToggle]="false" [dropdownFocusActivate]="true">
        <div #selectTagsBox
            (click)="focusTagsInput()" 
            (keydown)="onSelectTagsBoxKeydown($event)"
            class="select-tags-box">
            <select-items #tagSelectItems
                [(ngModel)]="selectedItems"
                [hideControls]="true"
                [removeButton]="removeButton && !readonly"
                [disabled]="disabled"
                [readonly]="readonly"
                [items]="valueAccessor.model"
                (itemsChange)="onItemsChange($event)"
                (onSelect)="onTagSelect($event)"
                [customToggleLogic]="selectItemsToggleLogic"
                [labelBy]="valueBy ? listLabelBy : (listLabelBy || labelBy)"
                [trackBy]="valueBy ? listTrackBy : (listTrackBy || trackBy)"
                [customItemTemplates]="selectTagsTemplate?.itemTemplates">
            </select-items>
            <input #selectTagsBoxInput 
                   class="select-tags-input"
                   [class.hidden]="items && valueAccessor.model && items.length === valueAccessor.model.length && !loader"
                   dropdown-open
                   type="text"
                   [autofocus]="autofocus"
                   [placeholder]="placeholder"
                   [disabled]="isDisabled()"
                   [(ngModel)]="term"
                   (ngModelChange)="onTermChange(term)"
                   (focus)="load()"
                   (click)="load()"
                   (keydown)="onInputKeydown($event)"
                   (keyup)="recalculateInputWidth($event)"
                   (blur)="recalculateInputWidth($event)"
                   (keydown.enter)="addTerm()"/>
        </div>
        <div class="select-tags-non-unique" [class.hidden]="isTermUnique()">
            {{ nonUniqueTermLabel }}
        </div>
        <div class="select-tags-add-button" [class.hidden]="!persist || !term || !term.length">
            <a (click)="addTerm()">{{ addButtonLabel }}</a> {{ addButtonSecondaryLabel }}
        </div>
        <div class="select-tags-max-model-size-label" [class.hidden]="!maxModelSizeLabel || !maxModelSize || valueAccessor.model?.length < maxModelSize">
            {{ maxModelSizeLabel }}
        </div>
        <div class="select-tags-dropdown-menu dropdown-menu"
            [class.hidden]="!dropdownSelectItems.getItems().length"
             dropdown-not-closable-zone 
             tabindex="1">
            <select-items #dropdownSelectItems
                [ngModel]="valueAccessor.model" 
                (ngModelChange)="onModelChange($event)"
                [items]="items"
                [exclude]="exclude"
                [disable]="disable"
                [disableMessage]="disableMessage"
                [keyword]="term"
                [hideSelected]="true"
                [hideControls]="true"
                [multiple]="true"
                [labelBy]="labelBy"
                [searchBy]="searchBy"
                [trackBy]="trackBy"
                [valueBy]="valueBy"
                [limit]="limit"
                [filter]="filter"
                [orderBy]="orderBy"
                [orderDirection]="orderDirection"
                [selectAll]="selectAll"
                [selectAllLabel]="selectAllLabel"
                [disableBy]="disableBy"
                [reverse]="reverse"
                [customItemTemplates]="selectDropdownTemplate?.itemTemplates">
            </select-items>
        </div>
    </div>
</div>`,
    styles: [`
.select-tags {
}
.select-tags .hidden {
    display: none !important;
}
.select-tags-add-button {
    margin-top: 2px;
    float: right;
    font-size: 0.75em;
    color: #999;
}
.select-tags-max-model-size-label {
    margin-top: 2px;
    float: right;
    font-size: 0.75em;
    color: #999;
}
.select-tags-non-unique {
    margin-top: 2px;
    float: left;
    font-size: 0.75em;
    color: #992914;
}
.select-tags-add-button a {
    border-bottom: 1px dotted;
}
.select-tags .select-tags-dropdown .select-tags-input {
    border: none;
    outline: none;
    box-shadow: none;
    height: 25px;
    width: 4px;
    display: inline-block;
}
.select-tags .select-tags-dropdown {
    position: relative;
}
.select-tags .select-tags-dropdown-menu {
    position: absolute;
    top: 100%;
    width: 100%;
    left: 0;
    z-index: 1000;
    display: none;
    margin: 2px 0px 2px -1px;
    min-width: 160px;
    padding: 5px 0 5px 0;
    font-size: 14px;
    text-align: left;
    list-style: none;
    background-color: #fff;
    -webkit-background-clip: padding-box;
    background-clip: padding-box;
    border: 1px solid #ccc;
    border: 1px solid rgba(0, 0, 0, .15);   
}
.select-tags .select-tags-dropdown.open .dropdown-menu {
    display: block;
    outline: none;
}
.select-tags .select-tags-box {
    padding: 5px 5px 3px 5px;
    outline: 1px solid #CCC;
}
.select-tags .select-tags-box .select-items,
.select-tags .select-tags-box .select-items .select-items-group,
.select-tags .select-tags-box .select-items .select-items-multiple,
.select-tags .select-tags-box .select-items .select-items-single,
.select-tags .select-tags-box .select-items .radio-group,
.select-tags .select-tags-box .select-items .checkbox-group {
    display: inline;
}
.select-tags .select-tags-box .select-items .select-items-item .remove-button {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    display: inline-block;
    width: 20px;
    padding: 2px 0 0 0;
    font-size: 12px;
    font-weight: bold;
    color: inherit;
    text-align: center;
    text-decoration: none;
    vertical-align: middle;
    border-left: 1px solid #0073bb;
    -webkit-border-radius: 0 2px 2px 0;
    -moz-border-radius: 0 2px 2px 0;
    border-radius: 0 2px 2px 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}
.select-tags .select-tags-box .select-items .select-items-item .remove-button:hover {
    background: rgba(0, 0, 0, 0.05);
}
.select-tags .select-tags-box .select-items .select-items-item.with-remove-button {
    position: relative;
    padding-right: 24px !important;
}
.select-tags .select-tags-box .select-items .select-items-item {
    display: inline-block;
    padding: 2px 6px;
    margin: 0 3px 3px 0;
    color: #ffffff;
    cursor: pointer;
    background: #1da7ee;
    border: 1px solid #0073bb;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2), inset 0 1px rgba(255, 255, 255, 0.03);
    border-radius: 3px;
    background-image: linear-gradient(to bottom, #1da7ee, #178ee9);
    background-repeat: repeat-x;
    text-shadow: 0 1px 0 rgba(0, 51, 83, 0.3);
    background-color: #1b9dec;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.select-tags .select-tags-box .select-items .select-items-item.selected,
.select-tags .select-tags-box .select-items .select-items-item.selected {
    background-color: #0085d4;
    background-image: -moz-linear-gradient(top, #008fd8, #0075cf);
    background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#008fd8), to(#0075cf));
    background-image: -webkit-linear-gradient(top, #008fd8, #0075cf);
    background-image: -o-linear-gradient(top, #008fd8, #0075cf);
    background-image: linear-gradient(to bottom, #008fd8, #0075cf);
    background-repeat: repeat-x;
    border: 1px solid #00578d;
}
.select-tags .select-tags-box .select-items .select-items-item.selected .remove-button ,
.select-tags .select-tags-box .select-items .select-items-item.selected .remove-button {
    border-left-color: #00578d;
}
.select-tags .select-tags-dropdown-menu .select-items .no-selection,
.select-tags .select-tags-dropdown-menu .select-items .select-all,
.select-tags .select-tags-dropdown-menu .select-items .checkbox-item,
.select-tags .select-tags-dropdown-menu .select-items .radio-item {
    padding: 3px 15px;
    clear: both;
    font-weight: normal;
    line-height: 1.42857;
    color: #333333;
    white-space: nowrap;
    display: block;
}
.select-tags .select-tags-dropdown-menu .select-items .no-selection:hover,
.select-tags .select-tags-dropdown-menu .select-items .select-all:hover,
.select-tags .select-tags-dropdown-menu .select-items .checkbox-item:hover,
.select-tags .select-tags-dropdown-menu .select-items .radio-item:hover {
    text-decoration: none;
    color: #fff;
    background-color: #0095cc;
    cursor: pointer;
}
.select-tags .select-items .checkbox-item.disabled:hover,
.select-tags .select-items .radio-item.disabled:hover {
    color: #333;
    background-color: #eeeeee;
    cursor: not-allowed;
}
.select-tags.disabled .select-items .checkbox-item.disabled:hover, .select-tags .select-items .radio-item.disabled:hover{
    color: #BBB;
}
.select-tags.disabled,
.select-tags.disabled .select-tags-box .select-items .remove-button,
.select-tags.disabled .select-tags-box .select-items .select-items-item,
.select-tags.disabled .select-tags-box .select-items .no-selection,
.select-tags.disabled .select-tags-box .select-items .select-all,
.select-tags.disabled .select-tags-box .select-items .checkbox-item,
.select-tags.disabled .select-tags-box .select-items .radio-item {
    cursor: not-allowed;
}
.select-tags.disabled .select-tags-box .select-items .select-items-item .remove-button:hover {
    background: #EEE;
}
.select-tags.disabled .select-tags-box .select-items .select-items-item .remove-button {
    border-left: 1px solid #CCC;
}
.select-tags.disabled .select-tags-box .select-items .select-items-item {
    background: #EEE;
    border: 1px solid #CCC;
    color: #BBB;
    box-shadow: none;
    text-shadow: none;
}
.select-tags.readonly .select-tags-input {
    display: none;
}
.select-tags.readonly .select-tags-box .select-items .select-items-item {
    cursor: default;
}
`],
    encapsulation: ViewEncapsulation.None,
    providers: [
        Utils,
        SelectValueAccessor,
        SelectValidator,
        WidthCalculator,
        { provide: NG_VALUE_ACCESSOR, useExisting: SelectValueAccessor, multi: true },
        { provide: NG_VALIDATORS, useExisting: SelectValidator, multi: true }
    ]
})
export class SelectTags implements OnInit {

    // -------------------------------------------------------------------------
    // Inputs
    // -------------------------------------------------------------------------

    @Input()
    name: string;

    @Input()
    debounceTime = 500;

    @Input()
    minQueryLength = 2;

    @Input()
    persist: boolean = false;

    @Input()
    listTrackBy: string|((item: any) => string);

    @Input()
    listLabelBy: string|((item: any) => string);

    @Input()
    labelBy: string|((item: any) => string);

    @Input()
    searchBy: string|((item: any, keyword: string) => boolean);

    @Input()
    disableBy: string|((item: any) => string);

    @Input()
    orderBy: string|((item1: any, item2: any) => number);

    @Input()
    orderDirection: "asc"|"desc";

    @Input()
    readonly: boolean = false;

    @Input()
    disabled: boolean = false;

    @Input()
    limit: number;

    @Input()
    maxModelSize: number;

    @Input()
    loader: (term: string) => Observable<any>|Promise<any>;

    @Input()
    items: any[] = [];

    @Input()
    itemConstructor: ((term: string) => any);

    @Input()
    nonUniqueTermLabel: string;

    @Input()
    addButtonLabel: string;

    @Input()
    addButtonSecondaryLabel: string;

    @Input()
    removeButton: boolean = true;

    @Input()
    removeByKey: boolean = true;

    @Input()
    unique: boolean = false;

    @Input()
    selectAll: boolean = false;

    @Input()
    selectAllLabel: string;

    @Input()
    maxModelSizeLabel: string;

    /**
     * Additional filter to filter items displayed in the dropdown.
     */
    @Input()
    filter: (items: any[]) => any[];

    @Input()
    exclude: any[];

    @Input()
    disable: any[];

    @Input()
    disableMessage: string;

    @Input()
    autofocus: boolean = false;

    @Input()
    reverse: boolean;

    @Output()
    onSelect = new EventEmitter();

    // -------------------------------------------------------------------------
    // Input accessors
    // -------------------------------------------------------------------------

    @Input()
    set placeholder(placeholder: string) {
        this._placeholder = placeholder;
        if (!this.term)
            this.recalculateInputWidth(undefined, placeholder);
    }

    get placeholder() {
        return this._placeholder;
    }

    @Input()
    set valueBy(valueBy: string|((item: any) => any)) {
        this.valueAccessor.valueBy = valueBy;
    }

    get valueBy() {
        return this.valueAccessor.valueBy;
    }

    @Input()
    set trackBy(trackBy: string|((item1: any, item2: any) => boolean)) {
        this.valueAccessor.trackBy = trackBy;
    }

    get trackBy() {
        return this.valueAccessor.trackBy;
    }

    @Input()
    set required(required: boolean) {
        this.validator.options.required = required;
    }

    get required() {
        return this.validator.options.required;
    }

    @Input()
    set minModelSize(minModelSize: number) {
        this.validator.options.minModelSize = minModelSize;
    }

    get minModelSize() {
        return this.validator.options.minModelSize;
    }

    // -------------------------------------------------------------------------
    // Public Properties
    // -------------------------------------------------------------------------
    
    term: string = "";
    lastLoadTerm: string = "";
    selectedItems: any[] = [];

    @ViewChild("dropdownSelectItems")
    dropdownSelectItems: SelectItems;

    @ViewChild("selectTagsBoxInput")
    selectTagsBoxInput: ElementRef;

    @ViewChild("tagSelectItems")
    tagSelectItems: SelectItems;

    @ViewChild("selectTagsBox")
    selectTagsBox: ElementRef;

    @ContentChild(SelectTagsDropdownTemplate)
    selectDropdownTemplate: SelectTagsDropdownTemplate;

    @ContentChild(SelectTagsBoxTemplate)
    selectTagsTemplate: SelectTagsBoxTemplate;

    selectItemsToggleLogic = (options: { event: MouseEvent, valueAccessor: SelectValueAccessor, value: any }) => {
        if (options.event.metaKey || options.event.shiftKey || options.event.ctrlKey) {
            options.valueAccessor.addOrRemove(options.value);
        } else {
            options.valueAccessor.clear();
            options.valueAccessor.add(options.value);
        }
    };

    // -------------------------------------------------------------------------
    // Private Properties
    // -------------------------------------------------------------------------

    private _placeholder: string = "";
    private cursorPosition: number = 0;
    private originalModel = false;
    private initialized: boolean = false;
    private itemsAreLoaded: boolean = false;
    private loadDenounce: Function;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private widthCalculator: WidthCalculator,
                public valueAccessor: SelectValueAccessor,
                private validator: SelectValidator,
                private utils: Utils,
                @Optional() private defaultOptions: SelectControlsOptions) {
        this.valueAccessor.modelWrites.subscribe((model: any) => {
            if (model) {
                this.originalModel = true;

                if (this.initialized) {
                    this.cursorPosition = model.length;
                    this.recalculateInputWidth(undefined, this.term);
                }
            }
        });
    }

    // -------------------------------------------------------------------------
    // Lifecycle callbacks
    // -------------------------------------------------------------------------

    ngOnInit() {
        this.applyOptions();
        this.initialized = true;

        if (this.valueAccessor.model) {
            this.cursorPosition = this.valueAccessor.model.length;
        }

        this.loadDenounce = this.utils.debounce(() => this.load(), this.debounceTime);
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    getItemsFromSelectedItems() {
        let items = this.dropdownSelectItems.getItems();
        items = items.filter(item => {
            return this.selectedItems.some(selectedItem => {
                return selectedItem === this.dropdownSelectItems.getItemValue(item);
            });
        });
        // console.log(items);
        return items;
    }

    onTermChange(term: string) {
        this.originalModel = false;
        this.dropdownSelectItems.resetActive();

        if (!this.originalModel && typeof this.term === "string" && this.term.trim().length >= this.minQueryLength) {
            this.loadDenounce();
        }
    }

    /**
     * Load items using loader.
     */
    load(): void {
        if (this.readonly || !this.loader || this.originalModel || !this.term || this.term.length < this.minQueryLength || this.term === this.lastLoadTerm)
            return;

        const loaderResult = this.loader(this.term);

        if (loaderResult instanceof Promise) {
            loaderResult.then(items => this.prepareLoadedItems(items));
        } else if (loaderResult instanceof Observable) {
            loaderResult.subscribe(items => this.prepareLoadedItems(items));
        } else {
            this.prepareLoadedItems(loaderResult);
        }
    }

    prepareLoadedItems(items: any) {
        this.lastLoadTerm = this.term;
        this.itemsAreLoaded = true;
        this.items = [];
        if (items instanceof Array) {
            items = items.filter((item: any) => {
                if (this.valueBy)
                    return !this.valueAccessor.has(this.valueAccessor.extractModelValue(item));

                return !this.valueAccessor.has(item);
            });
            this.items = items;
        }
    }

    /**
     * On model change outside.
     */
    onModelChange(model: any[]) {
        if (!model) return;
        this.cursorPosition = model.length;
        this.valueAccessor.set(model);
        this.lastLoadTerm = "";
        this.term = "";
        this.recalculateInputWidth(undefined, this.term);
        this.focusTagsInput();
        this.onSelect.emit({ value: model, items: this.items });
        if (this.itemsAreLoaded)
            this.items = [];
    }

    onItemsChange(model: any[]) {
        if (!model) return;
        this.cursorPosition = model.length;
        this.valueAccessor.set(model);
    }

    /**
     * Adds new term to the tags input.
     */
    addTerm() {
        const term = this.term ? this.term.trim() : "";
        if (!term || !this.persist) return;
        if (this.dropdownSelectItems.hasActive()) return; // if dropdown has active then we select it, instead of adding a new term
        if (!this.isTermUnique()) return;

        const newModel = this.itemConstructor ? this.itemConstructor(term) : { [this.labelBy as string]: term };
        this.valueAccessor.addAt(newModel, this.cursorPosition);
        this.cursorPosition++;
        setTimeout(() => this.move()); // using timeout is monkey patch
        this.lastLoadTerm = "";
        this.term = "";
        if (this.itemsAreLoaded)
            this.items = [];
        this.recalculateInputWidth(undefined, term);
    }

    isTermUnique() {
        if (!this.term || !this.unique || !this.valueAccessor.model) return true;
        return !(this.valueAccessor.model as any[]).find(i => {
            return this.getItemLabel(i) === this.term;
        });
    }

    /**
     * Checks if this component is disabled.
     */
    isDisabled() {
        if (this.valueAccessor.model &&
            this.maxModelSize > 0 &&
            this.valueAccessor.model.length >= this.maxModelSize)
            return true;
        if (this.readonly)
            return true;

        return this.disabled;
    }

    /**
     * Gets item's label.
     */
    getItemLabel(item: any) { // todo: duplication
        if (!item) return ""; 
        const labelBy = this.valueBy ? this.listLabelBy : (this.listLabelBy || this.labelBy);
        
        if (labelBy) {
            if (typeof labelBy === "string") {
                return item[labelBy as string];

            } else if (typeof labelBy === "function") {
                return (labelBy as any)(item);
            }
        }

        return item;
    }

    /**
     * Recalculates input width. Input width always match input's contents.
     */
    recalculateInputWidth(event?: Event, value?: any) {
        this.widthCalculator.recalculateInputWidth(this.selectTagsBoxInput.nativeElement, event, value);
    }

    /**
     * When keydown in the tags input occurs we need to recalculate width of input.
     * Also we handle to some of them specifically:
     * - left, right to move input to the left or right
     * - backspace and delete to remove previous or next tag box
     */
    onInputKeydown(event: KeyboardEvent) {
        this.recalculateInputWidth(event);

        // actions with tags can be done when focus inside, but no text in the input box
        if (!this.term) {
            if (event.keyCode === 37) { // left
                this.moveLeft();
                event.preventDefault();

            } else if (event.keyCode === 39) { // right
                this.moveRight();
                event.preventDefault();

            } else if (event.keyCode === 8 && this.removeByKey) { // backspace
                this.valueAccessor.removeAt(this.cursorPosition - 1);
                setTimeout(() => this.moveLeft()); // using timeout is monkey patch

            } else if (event.keyCode === 46 && this.removeByKey) { // delete
                this.valueAccessor.removeAt(this.cursorPosition);
                setTimeout(() => this.move()); // using timeout is monkey patch

            }
        }
    }

    /**
     * Moves input to the left.
     */
    moveLeft() {
        if (this.cursorPosition === 0) return;
        --this.cursorPosition;
        this.move();
    }

    /**
     * Moves input to the right.
     */
    moveRight() {
        if (this.cursorPosition >= this.tagSelectItems.itemElements.toArray().length) return;
        ++this.cursorPosition;
        this.move();
    }

    /**
     * Sets the focus to tags input. Selected tag boxes should be unselected after this operation.
     */
    focusTagsInput() {
        this.selectedItems = [];
        this.selectTagsBoxInput.nativeElement.focus();
    }

    /**
     * When user keydowns on select-tags-input we need to capture backspace, delete, esc and Ctrl+A to make
     * operations with tag boxes.
     */
    onSelectTagsBoxKeydown(event: KeyboardEvent) {
        /*if (this.term) {
            this.focusTagsInput();
            return;
        }*/

        if (!this.term && (event.keyCode === 46 || event.keyCode === 8) && this.removeByKey && this.selectedItems.length) { // backspace or delete
            this.valueAccessor.removeMany(this.selectedItems);
            this.cursorPosition = this.valueAccessor.model.length;
            this.selectedItems = [];
            event.preventDefault();
            event.stopPropagation();
            this.focusTagsInput();

        } else if (!this.term && event.keyCode === 27) { // esc
            this.selectedItems = [];

        } else if (!this.term && event.keyCode === 65 && (event.metaKey || event.ctrlKey)) { // ctrl + A
            this.selectedItems = this.valueAccessor.model.map((i: any) => i);
            event.preventDefault();
            event.stopPropagation();

        } else if (event.keyCode === 38) { // top
            this.dropdownSelectItems.previousActive();
            event.preventDefault();
            event.stopPropagation();

        } else if (event.keyCode === 40) { // bottom
            this.dropdownSelectItems.nextActive();
            event.preventDefault();
            event.stopPropagation();

        } else if (event.keyCode === 13) { // enter
            this.dropdownSelectItems.selectActive();
        }

    }

    /**
     * When user clicks item in boxes a tag we need to stop the event propagation, because we don't want out input
     * to get a focus at this time.
     */
    onTagSelect(event: { event: MouseEvent }) {
        event.event.preventDefault();
        event.event.stopPropagation();
    }

    /**
     * Exposes items in the dropdown, so they can be customized.
     */
    get dropdownItems() {
        return this.items;
    }

    /**
     * Exposes items in the tags box, so they can be customized.
     */
    get tagsItems() {
        return this.valueAccessor.model;
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    /**
     * Moves input box into cursorPosition.
     */
    private move() {
        const items = this.tagSelectItems.itemElements.toArray();
        const input = this.selectTagsBoxInput.nativeElement;
        if (items[this.cursorPosition]) {
            const element = items[this.cursorPosition].nativeElement;
            element.parentElement.insertBefore(input, element);
        } else {
            if (this.cursorPosition === 0 || !items[this.cursorPosition - 1])
                return;

            const element = items[this.cursorPosition - 1].nativeElement;
            element.parentElement.insertBefore(input, element.nextSibling);
        }
        this.selectTagsBoxInput.nativeElement.focus();
    }

    /**
     * Applies default options.
     */
    private applyOptions() {
        const options = this.defaultOptions && this.defaultOptions.selectTags ? this.defaultOptions.selectTags : undefined;
        if (!this.debounceTime) {
            if (options && options.debounceTime !== undefined) {
                this.debounceTime = options.debounceTime;
            } else {
                this.debounceTime = 500;
            }
        }
        if (!this.minQueryLength) {
            if (options && options.minQueryLength !== undefined) {
                this.minQueryLength = options.minQueryLength;
            } else {
                this.minQueryLength = 2;
            }
        }
        if (!this.addButtonLabel) {
            if (options && options.addButtonLabel !== undefined) {
                this.addButtonLabel = options.addButtonLabel;
            } else {
                this.addButtonLabel = "add";
            }
        }
        if (!this.addButtonSecondaryLabel) {
            if (options && options.addButtonSecondaryLabel !== undefined) {
                this.addButtonSecondaryLabel = options.addButtonSecondaryLabel;
            } else {
                this.addButtonSecondaryLabel = "(or press enter)";
            }
        }
        if (!this.nonUniqueTermLabel) {
            if (options && options.nonUniqueTermLabel !== undefined) {
                this.nonUniqueTermLabel = options.nonUniqueTermLabel;
            } else {
                this.nonUniqueTermLabel = "item with such name already exist";
            }
        }
        if (!this.maxModelSizeLabel) {
            if (options && options.maxModelSizeLabel !== undefined) {
                this.maxModelSizeLabel = options.maxModelSizeLabel;
            } else {
                this.maxModelSizeLabel = "maximal number of tags selected";
            }
        }
    }

}
