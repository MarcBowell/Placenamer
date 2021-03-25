import React, { Component } from 'react';
import PlaceListingComponent from './PlaceListingComponent';
import MapComponent from './MapComponent';

export default class SearchResultsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            PlaceNameWidth: 0,
            MostRecentSearch: 0
        };
    }

    render() {  
        const placeNameWidthClass = "place-listing-width" + this.state.PlaceNameWidth;        

        return (<div className={`results-area ${placeNameWidthClass}`}>            
            <PlaceListingComponent
                SearchResults={this.props.SearchResults}
                PlaceNameMinimiseClick={this.PlaceNameWidthChangeClick} />
            <MapComponent SearchResults={this.props.SearchResults} />
        </div>);
    }

    shouldComponentUpdate(nextProps, nextState) {  
        let result = false;
        if (nextProps.CurrentSearch !== this.state.MostRecentSearch || nextState.PlaceNameWidth !== this.state.PlaceNameWidth) {
            this.setState({ MostRecentSearch: nextProps.CurrentSearch });
            result = true;
        }
        return result;
    }

    PlaceNameWidthChangeClick = () => {
        let placeWidth = 0;        
        if (this.state.PlaceNameWidth === 0)
            placeWidth = 1;                    
        this.setState({ PlaceNameWidth: placeWidth });
    }
}