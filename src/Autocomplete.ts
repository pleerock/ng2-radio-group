import {
    Component,
    Input,
    ViewEncapsulation,
    OnInit,
    Directive,
    ContentChildren,
    QueryList,
    ContentChild,
    Optional, EventEmitter, Output, ViewChild
} from "@angular/core";
import {NG_VALIDATORS, NG_VALUE_ACCESSOR} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {SelectValueAccessor} from "./SelectValueAccessor";
import {SelectValidator} from "./SelectValidator";
import {Utils} from "./Utils";
import {ItemTemplate} from "./ItemTemplate";
import {SelectControlsOptions} from "./SelectControlsOptions";
import {DropdownOpen} from "./DropdownOpen";
import {Dropdown} from "./Dropdown";

@Directive({
    selector: "autocomplete-dropdown-template"
})
export class AutocompleteDropdownTemplate {

    @ContentChildren(ItemTemplate)
    itemTemplates: QueryList<ItemTemplate>;

}

@Component({
    selector: "autocomplete",
    template: `
<div class="autocomplete">
    <div class="autocomplete-dropdown dropdown" dropdown [dropdownToggle]="false" [dropdownFocusActivate]="true">
        <div class="autocomplete-input" [class.autocomplete-input-group]="valueAccessor.multiple && persist">
            <input dropdown-open
                   type="text"
                   [autofocus]="autofocus"
                   [placeholder]="placeholder"
                   [disabled]="isDisabled()"
                   [(ngModel)]="term"
                   (ngModelChange)="onTermChange(term)"
                   (focus)="load()"
                   (click)="load()"
                   (keydown.enter)="addTerm()"/>
            <div class="autocomplete-add-button" [class.hidden]="!valueAccessor.multiple || !persist || !term || !term.length">
                <a (click)="addTerm()">{{ addButtonLabel }}</a> {{ addButtonSecondaryLabel }}
            </div>
        </div>
        <div class="autocomplete-dropdown-menu dropdown-menu"
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
                [multiple]="valueAccessor.multiple"
                [disabled]="disabled"
                [labelBy]="labelBy"
                [trackBy]="trackBy"
                [valueBy]="valueBy"
                [searchBy]="labelBy"
                [limit]="limit"
                [orderBy]="orderBy"
                [orderDirection]="orderDirection"
                [disableBy]="disableBy"
                [reverse]="reverse"
                [customItemTemplates]="dropdownTemplate?.itemTemplates"></select-items>
        </div>
    </div>
</div>`,
    styles: [`
.autocomplete .hidden {
    display: none !important;
}
.autocomplete .autocomplete-dropdown {
    position: relative;
}
.autocomplete .autocomplete-input input[disabled] {
    color: #CCC;
    background: #EEE;
    cursor: not-allowed;
}
.autocomplete .autocomplete-input input {
    display: block;
    width: 100%;
    padding: 6px 10px;
    font-size: 13px;
    line-height: 1.42857143;
    border: 1px solid #ccc;
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
    -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
}
.autocomplete .autocomplete-dropdown-menu {
    position: absolute;
    top: 100%;
    width: 100%;
    left: 0;
    z-index: 1000;
    display: none;
    float: left;
    min-width: 160px;
    padding: 5px 0;
    margin: 2px 0 0;
    font-size: 14px;
    text-align: left;
    list-style: none;
    background-color: #fff;
    -webkit-background-clip: padding-box;
    background-clip: padding-box;
    border: 1px solid #ccc;
    border: 1px solid rgba(0, 0, 0, .15);
}
.autocomplete .autocomplete-dropdown.open .dropdown-menu {
    display: block;
}
.autocomplete .autocomplete-dropdown-menu .select-items .no-selection,
.autocomplete .autocomplete-dropdown-menu .select-items .select-all,
.autocomplete .autocomplete-dropdown-menu .select-items .checkbox-item,
.autocomplete .autocomplete-dropdown-menu .select-items .radio-item {
    padding: 3px 15px;
    clear: both;
    font-weight: normal;
    line-height: 1.42857;
    color: #333333;
    white-space: nowrap;
    display: block;
}
.autocomplete .autocomplete-dropdown-menu .select-items .no-selection:hover,
.autocomplete .autocomplete-dropdown-menu .select-items .select-all:hover,
.autocomplete .autocomplete-dropdown-menu .select-items .checkbox-item:hover,
.autocomplete .autocomplete-dropdown-menu .select-items .radio-item:hover {
    text-decoration: none;
    color: #fff;
    background-color: #0095cc;
    cursor: pointer;
}
.autocomplete .select-items .checkbox-item.disabled:hover,
.autocomplete .select-items .radio-item.disabled:hover {
    color: #333;
    background-color: #eeeeee;
    cursor: not-allowed;
}
.autocomplete .autocomplete-add-button {
    float: right;
    font-size: 0.75em;
    color: #999;
}
.autocomplete .autocomplete-add-button a {
    border-bottom: 1px dotted;
}
`],
    encapsulation: ViewEncapsulation.None,
    providers: [
        Utils,
        SelectValueAccessor,
        SelectValidator,
        { provide: NG_VALUE_ACCESSOR, useExisting: SelectValueAccessor, multi: true },
        { provide: NG_VALIDATORS, useExisting: SelectValidator, multi: true }
    ]
})
export class Autocomplete implements OnInit {

    // -------------------------------------------------------------------------
    // Inputs
    // -------------------------------------------------------------------------

    /**
     * Items to be shown in the autocomplete. If there are no static list of items, and items are being loaded instead,
     * then [loader] should be used.
     */
    @Input()
    items: any[] = [];

    /**
     * Used to load items into autocomplete. If items are statically defined, then [items] must be used instead.
     */
    @Input()
    loader: (term: string) => Observable<any>|Promise<any>;

    /**
     * Autocomplete can work with both multiple and single-value ngModel.
     * Autocomplete automatically determine if your component should be multiple or not based on your ngModel -
     * in the case if ngModel is an array then multiple mode is set to true, otherwise it set to false.
     * This option explicitly set multiple mode, so its ignore whenever your ngModel is an array or not.
     */
    @Input()
    set multiple(multiple: boolean) {
        this.valueAccessor.multiple = multiple;
    }

    /**
     * By default autocomplete can't create a new items into your model. It can only select exist items from the
     * given items, or from the items from the loader. But if this option is set to true, then autocomplete will
     * be able to create a new instances of the object with the label given in the input, and set this value to the
     * ngModel.
     */
    @Input()
    persist: boolean = false;

    /**
     * Sets this ngModel to be filled as required option.
     */
    @Input()
    set required(required: boolean) {
        this.validator.options.required = required;
    }

    /**
     * Determines if ngModel of this component is required or not.
     */
    get required() {
        return this.validator.options.required;
    }

    /**
     * Disables this component, so user can't select items in the autocomplete anymore.
     */
    @Input()
    disabled: boolean = false;

    /**
     * Sets autofocus to autocomplete input.
     */
    @Input()
    autofocus: boolean = false;

    /**
     * Indicates if items in the dropdown should be shown in the reverse order.
     */
    @Input()
    reverse: boolean;

    /**
     * Specifies a property name which will be used to determine object's label in the input.
     * For example if your item is an object and you would like to show its name in the autocomplete input you must
     * provide a property of that object which serves as this object's name.
     * Alternatively, you can specify a function that will accepts that object and return a name of it.
     */
    @Input()
    itemLabelBy: string|((item: any) => string);

    /**
     * Specifies a property name which will be used to determine object's label in the dropdown.
     * For example if your item is an object and you would like to show its name in the dropdown you must
     * provide a property of that object which serves as this object's name.
     * Alternatively, you can specify a function that will accepts that object and return a name of it.
     */
    @Input()
    labelBy: string|((item: any) => string);

    /**
     * Specifies a property name which will be used to take a specific values of the selected objects.
     * Alternatively, you can specify a function that will accepts that object and return a value of it that you wish
     * to put into ngModel.
     */
    @Input()
    set valueBy(valueBy: string|((item: any) => string)) {
        this.valueAccessor.valueBy = valueBy;
    }

    /**
     * Gets property name (or function that returns it) which will be used to take a specific values of the selected objects.
     */
    get valueBy() {
        return this.valueAccessor.valueBy;
    }

    /**
     * Specifies a property name which will be used to track selection of the different objects.
     * Alternatively, you can specify a function that will accepts that object and return a tracking value.
     */
    @Input()
    set trackBy(trackBy: string|((item1: any, item2: any) => boolean)) {
        this.valueAccessor.trackBy = trackBy;
    }

    /**
     * Gets property name (or function that returns it) which will be used to take a tracking value.
     */
    get trackBy() {
        return this.valueAccessor.trackBy;
    }

    /**
     * Specifies a property name which will be used to order objects in the dropdown.
     * Alternatively, you can specify a function that will perform sorting comparision.
     */
    @Input()
    orderBy: string|((item1: any, item2: any) => number);

    /**
     * Specifies a property name which will be used to disable specific objects in the dropdown.
     * Alternatively, you can specify a function that accepts object and returns its disabled property.
     */
    @Input()
    disableBy: string|((item: any) => string);

    /**
     * A hinting string to be shown in the input when there is no value.
     */
    @Input()
    placeholder: string = "";

    /**
     * Defines order direction. "desc" value is used to perform descending ordering, and asc for ascending ordering.
     */
    @Input()
    orderDirection: "asc"|"desc" = "asc";

    /**
     * Label to be shown in the "add button" area.
     */
    @Input()
    addButtonLabel: string;

    /**
     * Secondary label to be shown in the "add button" area.
     */
    @Input()
    addButtonSecondaryLabel: string;

    /**
     * Maximal number of items that are allowed to be shown in the dropdown.
     */
    @Input()
    limit: number;

    /**
     * Debounce time between user typings and requests to load items.
     */
    @Input()
    debounceTime: number;

    /**
     * Minimal number of characters before which component performs a request to load items.
     */
    @Input()
    minQueryLength: number;

    /**
     * Maximal allowed items to be selected in the model. Used for multiple autocomplete.
     */
    @Input()
    maxModelSize: number;

    /**
     * Items needs to be excluded from the list of options provided by autocomplete in the dropdown.
     */
    @Input()
    exclude: any[];

    @Input()
    disable: any[];

    @Input()
    disableMessage: string;

    /**
     * If you want to create new items your way (lets say you want to initialize a class X), you can use this item
     * constructor function.
     */
    @Input()
    itemConstructor: ((term: string) => any);

    @Output()
    onSelect = new EventEmitter();

    // -------------------------------------------------------------------------
    // Public Properties
    // -------------------------------------------------------------------------

    term: string;

    emptyModelTerm: string;

    lastLoadTerm: string = "";

    @ContentChild(AutocompleteDropdownTemplate)
    dropdownTemplate: AutocompleteDropdownTemplate;

    @ViewChild(Dropdown)
    dropdown: Dropdown;

    // -------------------------------------------------------------------------
    // Private Properties
    // -------------------------------------------------------------------------

    private originalModel = false;
    private initialized: boolean = false;
    private itemsAreLoaded: boolean = false;
    private loadDebounce: Function;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(public valueAccessor: SelectValueAccessor,
                private validator: SelectValidator,
                private utils: Utils,
                @Optional() private defaultOptions: SelectControlsOptions) {
        this.valueAccessor.modelWrites.subscribe((model: any) => {
            if (model)
                this.originalModel = true;
            if (this.initialized)
                this.term = this.getItemLabel(model);
            if (this.emptyModelTerm && !model) {
                this.term = this.emptyModelTerm;
                this.emptyModelTerm = "";
            }
        });
    }

    // -------------------------------------------------------------------------
    // Lifecycle callbacks
    // -------------------------------------------------------------------------

    ngOnInit() {
        // apply default options
        this.applyOptions();

        this.initialized = true;
        this.term = this.getItemLabel(this.valueAccessor.model);
        this.loadDebounce = this.utils.debounce(() => this.load(), this.debounceTime);
    }

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    /**
     * Gets items in the dropdown. Shortcut method to be used in a custom templates.
     */
    get dropdownItems() {
        return this.items;
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Tweaks on term change.
     */
    onTermChange(term: string) {

        // if persist mode is set then create a new object
        if (!this.valueAccessor.multiple) {
            if (term && (!this.valueAccessor.model || this.getItemLabel(this.valueAccessor.model) !== term)) {
                this.originalModel = false;
                if (this.persist) {
                    const value = this.itemConstructor ? this.itemConstructor(term) : { [this.labelBy as string]: term };
                    this.valueAccessor.set(value);
                }
            }

            // if term is empty then clean the model
            if (this.valueAccessor.model && term === "") {
                this.valueAccessor.set(undefined);
            }
        } else {
            this.originalModel = false;
        }

        if (!this.originalModel && typeof this.term === "string" && this.term.trim().length >= this.minQueryLength) {
            this.loadDebounce();
        }
    }

    /**
     * Loads items using loader.
     */
    load(): void {
        if (!this.loader || this.originalModel || !this.term || this.term.length < this.minQueryLength || this.term === this.lastLoadTerm)
            return;

        const loaderResult = this.loader(this.term);

        if (loaderResult instanceof Promise) {
            loaderResult.then(items => {
                this.lastLoadTerm = this.term;
                this.items = items;
                this.itemsAreLoaded = true;
            });

        } else if (loaderResult instanceof Observable) {
            loaderResult.subscribe(items => {
                this.lastLoadTerm = this.term;
                this.items = items;
                this.itemsAreLoaded = true;
            });
        }
    }

    /**
     * Tweaks on ngModel change.
     */
    onModelChange(model: any) {
        this.valueAccessor.set(model);
        if (!this.valueAccessor.multiple && model) {
            this.term = this.getItemLabel(model);
            this.lastLoadTerm = this.term;
            this.onSelect.emit({ value: model, items: this.items });
            if (this.itemsAreLoaded)
                this.items = [];
        } else {
            this.lastLoadTerm = "";
            this.term = "";
            this.onSelect.emit({ value: "", items: this.items });
            if (this.itemsAreLoaded)
                this.items = [];
        }

        this.dropdown.close();
    }

    /**
     * Refreshes term in the autocomplete. Used for external libraries.
     */
    refreshTerm() {
        this.term = this.getItemLabel(this.valueAccessor.model);
    }

    /**
     * Adds a new item based on the inputted term.
     */
    addTerm() {
        if (!this.term || !this.persist || !this.valueAccessor.multiple) return;

        const newModel = this.itemConstructor ? this.itemConstructor(this.term) : { [this.labelBy as string]: this.term };
        this.valueAccessor.add(newModel);
        this.lastLoadTerm = "";
        this.term = "";
        this.items = [];
    }

    /**
     * Checks if component should be disabled or not.
     */
    isDisabled() {
        if (this.maxModelSize > 0 &&
            this.valueAccessor.multiple &&
            this.valueAccessor.model.length >= this.maxModelSize)
            return true;

        return this.disabled;
    }

    /**
     * Gets label for the item in the input box.
     */
    getItemLabel(item: any) {
        if (!item) return "";
        const labelBy = this.valueBy ? this.itemLabelBy : (this.itemLabelBy || this.labelBy);

        if (labelBy) {
            if (typeof labelBy === "string") {
                return item[labelBy as string];

            } else if (typeof labelBy === "function") {
                return (labelBy as any)(item);
            }
        }

        return item;
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    /**
     * Applies default options.
     */
    private applyOptions() {
        const options = this.defaultOptions && this.defaultOptions.autocomplete ? this.defaultOptions.autocomplete : undefined;
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
    }

}
