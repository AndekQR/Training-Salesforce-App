import { LightningElement } from 'lwc';
import noHeaderAppPage from '@salesforce/resourceUrl/noHeaderAppPage'
import { loadStyle } from 'lightning/platformResourceLoader';

export default class Tr_Home extends LightningElement {

    connectedCallback() {
       loadStyle(this, noHeaderAppPage);
    }
}