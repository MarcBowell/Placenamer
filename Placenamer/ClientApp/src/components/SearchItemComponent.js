import React, { Component } from 'react';

export default class SearchItemComponent extends Component {
    render() {
        const dotStyle = { backgroundColor: this.props.SearchText.Colour };        

        return (
            <div className="search-item-area">
                <input type="text"
                    value={this.props.SearchText.Text}
                    onChange={this.props.SearchTextChange}
                    placeholder="Place name text pattern"
                    className="search-textbox" />
                <span className={this.props.SearchText.GetDotCssClass()} style={dotStyle}></span>
                <div className="clear-search-button" onClick={this.props.SearchItemClearClick}>X</div>
            </div>);
    }
}
