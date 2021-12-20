import {LightningElement, track, wire} from 'lwc';
import noHeaderAppPage from '@salesforce/resourceUrl/noHeaderAppPage'
import {loadStyle} from 'lightning/platformResourceLoader';
import _getGamesHistory from '@salesforce/apex/TR_GameController.getArchivedGames';

import first from '@salesforce/label/c.first'
import previous from '@salesforce/label/c.previous'
import next from '@salesforce/label/c.next'
import last from '@salesforce/label/c.last'
import select_page_size from '@salesforce/label/c.select_page_size'
import search from '@salesforce/label/c.search'

const FIRST_PAGE_NUMBER = 1;
const PAGE_SIZES = [12, 24, 48, 96];

export default class Tr_GamesHistory extends LightningElement {

    paginationResponse;
    error;
    @track
    paginationParams = {
        pageNumber: FIRST_PAGE_NUMBER,
        pageSize: PAGE_SIZES[0],
        searchQuery: ''
    }
    labels = {
        first,
        previous,
        next,
        last,
        select_page_size,
        search
    }
    selectedGameId = '';

    get selectedGame() {
        if (this.paginationResponse) {
            if (this.selectedGameId) {
                return this.paginationResponse.data.find(element => element.id === this.selectedGameId);
            }
        }
    }

    handleClick(event) {
        this.selectedGameId = event.detail;
    }

    connectedCallback() {
        loadStyle(this, noHeaderAppPage);
        this.refreshHistoryData();
    }

    refreshHistoryData() {
        this.selectedGameId = '';
        _getGamesHistory({paginationRequest: this.paginationParams})
            .then(result => {
                this.paginationResponse = result
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                this.paginationResponse = undefined;
            })
    }

    get pageSizeOptions() {
        return PAGE_SIZES.map(element => {
            return {
                label: element,
                value: element
            }
        });
    }

    get isDisabledFirst() {
        if (this.paginationParams.pageNumber === FIRST_PAGE_NUMBER) {
            return true;
        }
        return false;
    }

    get isDisabledLast() {
        if (this.paginationParams.pageNumber === this.lastPageNumber) {
            return true;
        }
        return false;
    }

    get lastPageNumber() {
        if (this.paginationResponse) {
            return Math.ceil(this.paginationResponse.allItemsSize / this.paginationResponse.pageSize);
        }
        return FIRST_PAGE_NUMBER;
    }

    handlePageSizeChange(event) {
        this.paginationParams = {
            ...this.paginationParams,
            pageSize: Number(event.detail.value),
            pageNumber: FIRST_PAGE_NUMBER
        }
        this.refreshHistoryData();
    }

    handleFirst() {
        if (this.paginationParams.pageNumber > FIRST_PAGE_NUMBER) {
            this.paginationParams = {
                ...this.paginationParams,
                pageNumber: FIRST_PAGE_NUMBER
            };
            this.refreshHistoryData();
        }
    }

    handlePrevious() {
        if (this.paginationParams.pageNumber > FIRST_PAGE_NUMBER) {
            this.paginationParams = {
                ...this.paginationParams,
                pageNumber: (--this.paginationParams.pageNumber)
            };
            this.refreshHistoryData();
        }
    }

    handleNext() {
        if (this.paginationParams.pageNumber < this.lastPageNumber) {
            this.paginationParams = {
                ...this.paginationParams,
                pageNumber: (++this.paginationParams.pageNumber)
            };
            this.refreshHistoryData();
        }
    }

    handleLast() {
        if (this.paginationParams.pageNumber < this.lastPageNumber) {
            this.paginationParams = {
                ...this.paginationParams,
                pageNumber: this.lastPageNumber
            };
            this.refreshHistoryData();
        }
    }

    onSearchQueryChange(event) {
        this.paginationParams = {
            ...this.paginationParams,
            searchQuery: event.target.value
        };
        this.refreshHistoryData();
    }
}