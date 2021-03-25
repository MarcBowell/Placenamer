export default class SearchItem {
    constructor(colour) {
        this.Colour = colour;
    }

    Text = "";
    MostRecentCompletedSearchText = "";
    Colour = "";
    Items = [];
    IsSearching = false;

    GetDotCssClass = () => {
        if (this.IsSearching) {
            return "dot dot-blinking";
        }
        else {
            if (this.MostRecentCompletedSearchText === "" || this.MostRecentCompletedSearchText !== this.Text) {
                return "dot dot-partial";
            }
            else {
                return "dot dot-full";
            }
        }
    }
}