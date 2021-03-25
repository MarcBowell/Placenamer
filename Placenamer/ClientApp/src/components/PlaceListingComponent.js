import React, { Component } from 'react';

export default class PlaceListingComponent extends Component {
    render() {
        return (<div className="place-listing">
                <div onClick={this.props.PlaceNameMinimiseClick} id="place-list-minimize-button"></div>                
                {this.renderBody()}
            </div>);
    }

    renderBody = () => {
        if (this.props.SearchResults.filter(item => item.MostRecentCompletedSearchText !== "").length > 0) {
            return this.props.SearchResults.filter(item => item.MostRecentCompletedSearchText !== "").map(item => this.renderSearchItem(item));
        }
        else {
            return (<div className="place-listing-no-items"></div>);
        }
    }

    renderSearchItem = (item) => {
        const dotStyle = { backgroundColor: item.Colour }; 
        return (
            <div key={item.MostRecentCompletedSearchText} className="search-item-listing-block">
                <span title={item.MostRecentCompletedSearchText} className={item.GetDotCssClass()} style={dotStyle}></span>
                <div className="search-item-listing-text">
                    {this.searchItemText(item.MostRecentCompletedSearchText)}                    
                </div>
                {this.renderSearchItemTotal(item)}
            </div>)
    }

    renderSearchItemTotal = (item) => {
        return (<div className="search-item-listing-count">{item.IsSearching ? "Searching..." : `${item.Items.length} place(s) found`}</div>);
    }

    searchItemText = (text) => {
        if (text.length > 25)
            return text.substring(0, 25) + "...";
        else
            return text;
    }
}