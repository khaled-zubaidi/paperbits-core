import * as ko from "knockout";
import * as Objects from "@paperbits/common/objects";
import template from "./cardEditor.html";
import { ViewManager } from "@paperbits/common/ui";
import { WidgetEditor } from "@paperbits/common/widgets";
import { StyleService } from "@paperbits/styles";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { CardModel } from "../cardModel";
import { BackgroundStylePluginConfig, TypographyStylePluginConfig, ContainerStylePluginConfig } from "@paperbits/styles/contracts";
import { EventManager } from "@paperbits/common/events";
import { StyleHelper } from "@paperbits/common/styles/styleHelper";


@Component({
    selector: "card-editor",
    template: template
})
export class CardEditor implements WidgetEditor<CardModel> {
    public readonly background: ko.Observable<BackgroundStylePluginConfig>;
    public readonly typography: ko.Observable<TypographyStylePluginConfig>;
    public readonly appearanceStyles: ko.ObservableArray<any>;
    public readonly appearanceStyle: ko.Observable<any>;
    public readonly containerConfig: ko.Observable<ContainerStylePluginConfig>;

    constructor(
        private readonly viewManager: ViewManager,
        private readonly styleService: StyleService,
        private readonly eventManager: EventManager
    ) {
        this.appearanceStyles = ko.observableArray<any>();
        this.appearanceStyle = ko.observable<any>();
        this.containerConfig = ko.observable<ContainerStylePluginConfig>();
        this.background = ko.observable<BackgroundStylePluginConfig>();
    }

    @Param()
    public model: CardModel;

    @Event()
    public onChange: (model: CardModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        const variations = await this.styleService.getComponentVariations("card");

        this.appearanceStyles(variations.filter(x => x.category === "appearance"));
        this.updateObservables();

        this.appearanceStyle.subscribe(this.onAppearanceChange);
        this.eventManager.addEventListener("onViewportChange", this.updateObservables);
    }

    private updateObservables(): void {
        const viewport = this.viewManager.getViewport();

        const containerStyleConfig = StyleHelper.getPluginConfig(this.model.styles, "container", viewport);
        this.containerConfig(containerStyleConfig);

        const backgroundStyleConfig = StyleHelper.getPluginConfig(this.model.styles, "background", viewport);
        this.background(backgroundStyleConfig);

        this.appearanceStyle(this.model.styles.appearance);
    }

    public onContainerChange(pluginConfig: ContainerStylePluginConfig): void {
        const viewport = this.viewManager.getViewport();
        StyleHelper.setPluginConfig(this.model.styles, "container", pluginConfig, viewport);

        this.onChange(this.model);
    }

    public onBackgroundUpdate(background: BackgroundStylePluginConfig): void {
        StyleHelper.setPluginConfig(this.model.styles, "background", background);
        this.onChange(this.model);
    }

    public onAppearanceChange(): void {
        Objects.setValue("styles/appearance", this.model, this.appearanceStyle());

        this.onChange(this.model);
    }
}
