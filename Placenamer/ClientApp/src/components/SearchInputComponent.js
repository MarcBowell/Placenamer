import React, { Component } from 'react';
import SearchItemComponent from './SearchItemComponent';

export default class SearchInputComponent extends Component {
    render() {
        return (
            <div className="search-input">
                <div id="title-bar">UK place name search tool</div>
                <div onClick={this.props.MaximiseMinimiseClick} id="search-maximise-button">&lt;</div>
                <p className="title-bar-help">Enter UK place name or text pattern with <em>-</em> as wildcard character</p>
                <p className="title-bar-help">Examples: <em>man-</em> (prefix) <em>-chester</em> (suffix)</p>
                <p className="title-bar-help">Examples: <em>-chest-</em> (containing) <em>manchester</em> (full place name)</p>
                <p className="title-bar-help">Search for more than one text pattern separated by comma <em>ash-, oak-, hazel-</em></p>
                {this.RenderSearchTextItem(0)}
                {this.RenderSearchTextItem(1)}
                {this.RenderSearchTextItem(2)}
                {this.RenderSearchTextItem(3)}
                {this.RenderSearchTextItem(4)}
                <button id="filter-button" href="#" onClick={this.props.SearchButtonClick}>Search</button>
            </div>
        );
    }

    RenderSearchTextItem = (searchTextItemNo) => {
        return (
            <SearchItemComponent
                SearchText={this.props.SearchTextItems[searchTextItemNo]}
                SearchTextChange={(event) => this.props.SearchTextChange(event, searchTextItemNo)}
                SearchItemClearClick={() => this.props.SearchItemClearClick(searchTextItemNo)}
                SearchItemAddClick={this.props.SearchItemAddClick}
                SearchItemRemoveClick={this.props.SearchItemRemoveClick}
                ShowAddButton={this.props.SearchHeight === searchTextItemNo + 1} />
            );
    } 
}