class Gallery {
    constructor(name) {
        this.name = name, 
        this.date = new Date();
        this.active = true;
        this.photos = [];
    }
}

export default Gallery;