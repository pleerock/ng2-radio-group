import {Component, Input, ViewEncapsulation, ViewChild, Optional} from "@angular/core";
import {NG_VALIDATORS, NG_VALUE_ACCESSOR} from "@angular/forms";
import {SelectItems} from "./SelectItems";
import {SelectValidator} from "./SelectValidator";
import {SelectValueAccessor} from "./SelectValueAccessor";
import {SelectControlsOptions} from "./SelectControlsOptions";
import {Dropdown} from "./Dropdown";

@Component({
    selector: "select-dropdown",
    template: `
<div class="select-dropdown">
    <div class="select-dropdown-dropdown dropdown" dropdown>
        <div class="select-dropdown-box" tabindex="1"
     (keydown)="onSelectTagsBoxKeydown($event)" dropdown-open>
            <div *ngIf="isModelMultiple">
                <span [class.hidden]="listSelectItems.getItems().length > 0">
                    <span class="no-selection" [class.readonly]="readonly" [class.disabled]="disabled">{{ readonly ? (readonlyLabel || label) : label }}</span>
                </span>
                <select-items #listSelectItems
                      [hideControls]="true"
                      [items]="getSelectedItems()"
                      [labelBy]="labelBy"
                      [trackBy]="trackBy"
                      [disabled]="disabled"
                      [required]="required"
                      [readonly]="true"></select-items>
            </div>
            <div *ngIf="!isModelMultiple">
                <span [class.hidden]="valueAccessor.model">
                    <span class="no-selection" [class.readonly]="readonly" [class.disabled]="disabled">{{ readonly ? (readonlyLabel || label) : label }}</span>
                </span>
                <span [class.hidden]="!valueAccessor.model">
                    <span class="single-selected" [class.readonly]="readonly" [class.disabled]="disabled">{{ getItemLabel(valueAccessor.model) }}</span>
                </span>
            </div>
            <div style="clear: left"></div>
        </div>
        <div dropdown-not-closable-zone>
            <div class="select-dropdown-dropdown-menu dropdown-menu"
                 [class.hidden]="readonly || disabled || (!dropdownSelectItems.getItems().length && !searchBy)"
                 tabindex="1">
                <select-items #dropdownSelectItems
                    [ngModel]="valueAccessor.model" 
                    (ngModelChange)="onModelChange($event)" 
                    [items]="items"
                    [exclude]="exclude"
                    [disable]="disable"
                    [disableMessage]="disableMessage"
                    [multiple]="valueAccessor.multiple"
                    [limit]="limit"
                    [disabled]="disabled"
                    [labelBy]="labelBy"
                    [trackBy]="trackBy"
                    [valueBy]="valueBy"
                    [disableBy]="disableBy"
                    [searchBy]="searchBy"
                    [searchLabel]="searchLabel"
                    [orderBy]="orderBy"
                    [orderDirection]="orderDirection"
                    [selectAll]="selectAll"
                    [selectAllLabel]="selectAllLabel"
                    [noSelection]="noSelection"
                    [noSelectionLabel]="noSelectionLabel"
                    [hideControls]="hideControls"
                    [maxModelSize]="maxModelSize"
                    [minModelSize]="minModelSize"
                    [filter]="filter"></select-items>
            </div>
        </div>
    </div>
</div>`,
    styles: [`
.select-dropdown .hidden {
    display: none !important;
}
.select-dropdown .select-dropdown-box {
    outline: none;
}
.select-dropdown .select-dropdown-box .select-items-item {
    display: inline-block;
}
.select-dropdown .btn-plus {
    border-left: none;
}
.select-dropdown .select-dropdown-dropdown {
    position: relative;
}
.select-dropdown .select-dropdown-dropdown-menu {
    position: absolute;
    top: 100%;
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
.select-dropdown .dropdown.open .dropdown-menu {
    display: block;
    outline: none;
}
.select-dropdown .select-dropdown-box .single-selected, 
.select-dropdown .select-dropdown-box .select-items .select-items-item .select-items-label, 
.select-dropdown .select-dropdown-box .no-selection {
    color: #337ab7;
    border-bottom: 1px dashed #337ab7;
    cursor: pointer;
}
.select-dropdown .dropdown-menu .select-items .select-items-item.selected {
    text-decoration: none;
    color: #fff;
    background-color: #0095cc;
}
.select-dropdown .dropdown-menu .select-items .select-items-item.active.selected {
    background-color: #469FE0;
}
.select-dropdown .select-dropdown-box .single-selected.disabled, 
.select-dropdown .select-dropdown-box .no-selection.disabled {
    color: #CCC;
    border-bottom: 1px dashed #CCC;
    cursor: not-allowed;
}
.select-dropdown .select-dropdown-box .single-selected.readonly, 
.select-dropdown .select-dropdown-box .no-selection.readonly {
    color: #333;
    border: none;
    cursor: default;
}
.select-dropdown .select-dropdown-box .select-items .select-items-label {
    padding-right: 0;
}
.select-dropdown .select-dropdown-box .select-items .select-items-item .select-items-separator {
    padding-right: 2px;
}
.select-dropdown .select-dropdown-box .select-items .select-items-item .select-items-separator:before {
    content: ",";
}
.select-dropdown .select-dropdown-dropdown-menu .select-items .no-selection,
.select-dropdown .select-dropdown-dropdown-menu .select-items .select-all,
.select-dropdown .select-dropdown-dropdown-menu .select-items .checkbox-item,
.select-dropdown .select-dropdown-dropdown-menu .select-items .radio-item {
    padding: 3px 10px;
    clear: both;
    font-weight: normal;
    line-height: 1.42857;
    white-space: nowrap;
    display: block;
}
.select-dropdown .select-dropdown-dropdown-menu .select-items .no-selection:hover,
.select-dropdown .select-dropdown-dropdown-menu .select-items .select-all:hover,
.select-dropdown .select-dropdown-dropdown-menu .select-items .checkbox-item:hover,
.select-dropdown .select-dropdown-dropdown-menu .select-items .radio-item:hover {
    text-decoration: none;
    color: #fff;
    background-color: #0095cc;
    cursor: pointer;
}
.select-dropdown .select-dropdown-dropdown-menu .select-items .checkbox-item.disabled:hover,
.select-dropdown .select-dropdown-dropdown-menu .select-items .radio-item.disabled:hover {
    color: #333;
    background-color: #eeeeee;
    cursor: not-allowed;
}
.select-dropdown .select-dropdown-dropdown-menu .select-items .select-items-search {
    margin: 0 5px 5px 5px;
}
`],
    encapsulation: ViewEncapsulation.None,
    providers: [
        SelectValueAccessor,
        SelectValidator,
        { provide: NG_VALUE_ACCESSOR, useExisting: SelectValueAccessor, multi: true },
        { provide: NG_VALIDATORS, useExisting: SelectValidator, multi: true }
    ]
})
export class SelectDropdown {

    // -------------------------------------------------------------------------
    // Inputs
    // -------------------------------------------------------------------------

    @Input()
    items: any[];

    @Input()
    label: string = "click to select";

    @Input()
    readonly: boolean = false;

    @Input()
    readonlyLabel: string;

    @Input()
    labelBy: string|((item: any) => string);

    @Input()
    disableBy: string|((item: any) => string);

    @Input()
    searchBy: string|((item: any, keyword: string) => boolean);

    @Input()
    orderBy: string|((item1: any, item2: any) => number);

    @Input()
    orderDirection: "asc"|"desc";

    @Input()
    disabled: boolean = false;

    @Input()
    limit: number;

    @Input()
    noSelection: boolean = false;

    @Input()
    noSelectionLabel: string;

    @Input()
    searchLabel: string;

    @Input()
    selectAll: boolean = false;

    @Input()
    selectAllLabel: string;

    @Input()
    hideControls: boolean;

    @Input()
    maxModelSize: number;

    @Input()
    minModelSize: number;

    @Input()
    filter: (items: any[]) => any[];

    @Input()
    exclude: any[];

    @Input()
    disable: any[];

    @Input()
    disableMessage: string;

    // -------------------------------------------------------------------------
    // Input accessors
    // -------------------------------------------------------------------------

    @Input()
    set multiple(multiple: boolean) {
        this.valueAccessor.multiple = multiple;
    }

    @Input()
    set valueBy(valueBy: string|((item: any) => string)) {
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

    // -------------------------------------------------------------------------
    // Private Properties
    // -------------------------------------------------------------------------

    @ViewChild(Dropdown)
    dropdown: Dropdown;

    @ViewChild("dropdownSelectItems")
    selectItems: SelectItems;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(public valueAccessor: SelectValueAccessor,
                private validator: SelectValidator,
                @Optional() private defaultOptions: SelectControlsOptions) {
    }

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    get isModelMultiple() {
        return this.valueAccessor.model instanceof Array;
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    getSelectedItems() {
        const selectedItems = this.selectItems.getSelectedItems();
        if (this.valueBy) {
            return this.items.filter(item => {
                return !!selectedItems.find(selectedItem => {
                    return this.valueAccessor.extractModelValue(item) === selectedItem; // todo: what about track by?
                });
            });
        }

        return selectedItems;
    }

    getItemLabel(item: any) { // todo: duplication
        if (!item) return "";

        if (this.valueBy) {
            item = this.items.find(itemFromList => {
                return this.valueAccessor.extractModelValue(itemFromList) === item; // todo: what about track by?
            });
        }

        if (this.labelBy) {
            if (typeof this.labelBy === "string") {
                return item[this.labelBy as string];

            } else if (typeof this.labelBy === "function") {
                return (this.labelBy as any)(item);
            }
        }

        return item;
    }

    onModelChange(model: any) {
        this.valueAccessor.set(model);
        if (!this.valueAccessor.multiple) {
            this.dropdown.close();
        }
    }

    /**
     * When user keydowns on component we need to capture esc/enter/arrows to make possible keyboard management.
     */
    onSelectTagsBoxKeydown(event: KeyboardEvent) {
        if (event.keyCode === 27 && this.dropdown.isOpened()) {
            this.dropdown.close();

        } else if (event.keyCode === 38) { // top
            this.selectItems.previousActive();
            event.preventDefault();
            event.stopPropagation();

        } else if (event.keyCode === 40) { // bottom
            this.selectItems.nextActive();
            event.preventDefault();
            event.stopPropagation();

        } else if (event.keyCode === 13 || event.keyCode === 32) { // enter or space
            this.selectItems.selectActive();
            event.preventDefault();
            event.stopPropagation();
        }

    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    /**
     * Applies default options.
     */
    private applyOptions() {
        const options = this.defaultOptions && this.defaultOptions.selectDropdown ? this.defaultOptions.selectDropdown : undefined;
        if (!this.noSelectionLabel) {
            if (options && options.noSelectionLabel !== undefined) {
                this.noSelectionLabel = options.noSelectionLabel;
            } else {
                this.noSelectionLabel = "no selection";
            }
        }
        if (!this.selectAllLabel) {
            if (options && options.selectAllLabel !== undefined) {
                this.selectAllLabel = options.selectAllLabel;
            } else {
                this.selectAllLabel = "select all";
            }
        }
        if (!this.searchLabel) {
            if (options && options.searchLabel !== undefined) {
                this.searchLabel = options.searchLabel;
            } else {
                this.searchLabel = "";
            }
        }
    }

}
