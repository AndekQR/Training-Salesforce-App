import {LightningElement, api } from 'lwc';

export default class Tr_StopWatch extends LightningElement {

    timeValue = '';
    totalMilliseconds = 0;
    @api
    minutes;
    interval;

    @api
    forceStop() {
        clearInterval(this.interval);
    }

    connectedCallback() {
        this.totalMilliseconds = this.minutes * 60000;
        this.startInterval();
    }

    startInterval() {
        this.interval = setInterval( () => {
            if (this.totalMilliseconds <= 0) {
                clearInterval(this.interval);
                this.dispatchEvent(new CustomEvent('timefinish'));
                this.totalMilliseconds = 0;
            }

            console.log('timer');
            this.timeValue = new Date(this.totalMilliseconds).toISOString().substr(11, 8);
            this.totalMilliseconds -= 1000;
        }, 1000);
    }
}