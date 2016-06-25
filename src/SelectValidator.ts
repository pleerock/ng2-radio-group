import {Injectable} from "@angular/core";
import {Control, Validator} from "@angular/common";

@Injectable()
export class SelectValidator implements Validator {

    // -------------------------------------------------------------------------
    // Public Properties
    // -------------------------------------------------------------------------

    options: {
        required?: boolean;
        minModelSize?: number;
    } = {};
    
    // -------------------------------------------------------------------------
    // Implemented from Validator
    // -------------------------------------------------------------------------

    validate(c: Control) {
        if (!this.options) return null;
        
        const errors: any = {};
        if (this.options.required && (!c.value || (c.value instanceof Array) && c.value.length === 0))
            errors.required = true;
        if (this.options.minModelSize && (!c.value || (c.value instanceof Array) && c.value.length < this.options.minModelSize))
            errors.minModelSize = true;
        
        return Object.keys(errors).length > 0 ? errors : null;
    }

}