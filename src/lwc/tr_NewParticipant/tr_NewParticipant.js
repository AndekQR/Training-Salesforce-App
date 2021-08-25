import {LightningElement} from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import cancel from '@salesforce/label/c.cancel'
import submit from '@salesforce/label/c.submit'
import close from '@salesforce/label/c.close'
import new_participant from '@salesforce/label/c.new_participant'

export default class Tr_NewParticipant extends LightningElement {

    labels = {cancel, submit, close, new_participant}

    handleClose() {
        this.handleReset();
        this.dispatchEvent(new CustomEvent('close'));
    }

    handleSuccess() {
        const toastEvent = new ShowToastEvent({
            title: 'Participant created',
            variant: 'success'
        });
        this.dispatchEvent(toastEvent);
        this.handleClose();
        this.dispatchEvent(new CustomEvent('success'));
    }

    handleReset() {
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }
}