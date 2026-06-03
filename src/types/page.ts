export interface BasePageConfig {
    type: 'about' | 'publication' | 'card' | 'text';
    title: string;
    description?: string;
}

export interface PublicationPageConfig extends BasePageConfig {
    type: 'publication';
    source: string;
    google_scholar_url?: string;
}

export interface TextPageConfig extends BasePageConfig {
    type: 'text';
    source: string;
}

export interface CardLink {
    label: string;
    url: string;
}

export interface CardItem {
    title: string;
    subtitle?: string;
    role?: string;
    institution?: string;
    date?: string;
    terms?: string[];
    content?: string;
    tags?: string[];
    link?: string;
    links?: CardLink[];
    image?: string;
}

export interface CardPageConfig extends BasePageConfig {
    type: 'card';
    items: CardItem[];
}
