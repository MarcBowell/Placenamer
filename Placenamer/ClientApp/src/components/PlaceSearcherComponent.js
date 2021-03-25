import React, { Component } from 'react';
import SearchInputComponent from './SearchInputComponent';
import SearchResultsComponent from './SearchResultsComponent';
import SearchItem from '../helpers/SearchItem';

export default class PlaceSearcherComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            SearchHeight: 0,
            SearchItems: 1,
            SearchTextItems: [new SearchItem('Red'),
                new SearchItem('Blue'),
                new SearchItem('Green'),
                new SearchItem('Black'),
                new SearchItem('Purple')],
            CurrentSearch: 0
        };
    }

    render() {
        const searchHeightClass = "search-height" + this.state.SearchHeight;

        return (<div className={searchHeightClass}>
            <SearchInputComponent                
                SearchHeight={this.state.SearchHeight}
                MaximiseMinimiseClick={this.SearchAreaMinimiseMaximiseClick}
                SearchTextChange={this.SearchTextChange}
                SearchItemClearClick={this.SearchItemClearClick}
                SearchTextItems={this.state.SearchTextItems}
                SearchItemAddClick={this.AddSearchItemClick}
                SearchItemRemoveClick={this.RemoveSearchItemClick}
                SearchButtonClick={this.SearchButtonClick}
            />
            <SearchResultsComponent SearchResults={this.state.SearchTextItems} CurrentSearch={this.state.CurrentSearch} />
        </div>)
    }

    SearchTextChange = (event, searchItemNo) => {
        if (this.SearchTextIsValid(event.target.value))
            this.ChangeSearchText(searchItemNo, event.target.value);
    }

    SearchTextIsValid = (text) => {
        let result = true;
        for (let charNo = 0; charNo < text.length; charNo++) {
            result = result && (this.IsBetween(text[charNo], 'a', 'z')
                || this.IsBetween(text[charNo], 'A', 'Z')
                || text[charNo] == ' '
                || text[charNo] == ','
                || text[charNo] == '-');
            console.log( result);
        }        
        return result;
    }

    IsBetween = (character, first, last) => {
        return (character > first && character < last) || character == first || character == last;            
    }

    ChangeSearchText(searchItemNo, newText) {
        let searchTextItems = this.state.SearchTextItems.map(item => item);
        searchTextItems[searchItemNo].Text = newText;
        this.setState({ SearchTextItems: searchTextItems });
    }

    ChangeSearchItem(searchItemNo, newItem) {
        let searchTextItems = this.state.SearchTextItems.map(item => item);
        searchTextItems[searchItemNo] = newItem;
        this.setState({ SearchTextItems: searchTextItems });
    }

    ItemSearchBegin = (searchItemNo) => {
        let searchItem = this.state.SearchTextItems[searchItemNo];
        searchItem.IsSearching = true;
        this.ChangeSearchItem(searchItemNo, searchItem);
        this.setState({ SearchIsRequired: false });
    }

    ItemSearchComplete = (searchItemNo, searchResult) => {
        if (searchResult.success) {
            let searchItem = this.state.SearchTextItems[searchItemNo];
            searchItem.IsSearching = false;
            searchItem.Items = searchResult.result;
            searchItem.MostRecentCompletedSearchText = searchItem.Text;
            this.ChangeSearchItem(searchItemNo, searchItem);
            let currentSearch = this.state.CurrentSearch;
            currentSearch++;
            this.setState({ CurrentSearch: currentSearch });
        }
        else {
            let searchItem = this.state.SearchTextItems[searchItemNo];
            searchItem.IsSearching = false;
            this.ChangeSearchItem(searchItemNo, searchItem);
            alert(searchResult.errorMessage);
        }
    }

    SearchAreaMinimiseMaximiseClick = () => {
        let searchHeight = this.state.SearchHeight;
        if (searchHeight > 0)
            searchHeight = 0;
        else
            searchHeight = this.state.SearchItems;
        this.setState({ SearchHeight: searchHeight });
    }

    SearchItemClearClick = (searchTextItemNo) => {
        this.ChangeSearchText(searchTextItemNo, "");
    }

    SearchAllBegin = () => {
        this.setState({ SearchIsRequired: false });
    }

    SearchButtonClick = () => {
        this.state.SearchTextItems.forEach((item, index) => this.PerformItemSearch(item, index));
    }

    PerformItemSearch = (item, index) => {
        if (item.MostRecentCompletedSearchText !== item.Text) {
            this.ItemSearchBegin(index);

            if (item.Text === "") {
                this.ItemSearchComplete(index, { success: true, result: [] });
            }
            else {
                fetch("places?search=" + item.Text)
                    .then(response => response.json())
                    .then(data => this.ItemSearchComplete(index, data));
            }
        }
    }
}