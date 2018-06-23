﻿import * as ko from "knockout";
import template from "./youtube.html";
import { Component } from "../../ko/component";

@Component({
    selector: "paperbits-youtube-player",
    template: template
})
export class YoutubePlayerViewModel {
    public videoId: KnockoutObservable<string>;

    constructor() {
        this.videoId = ko.observable<string>();
    }
}