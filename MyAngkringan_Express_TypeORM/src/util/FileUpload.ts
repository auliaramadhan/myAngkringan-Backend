import multer = require("multer");
import * as  fs from "fs"


export enum dirUpload {
    Restauran = "/images/uploads/restaurant/",
    Item = "/images/uploads/item/",
    Profile = "/images/uploads/profile/",
     

}

export class FileUpload{

    dir : dirUpload;

    constructor( dir : dirUpload ){
        this.dir = dir;
    }
    
    private fileFilter (req, file, callback)  {
        var ext = file.originalname.split(".").pop();
        if (ext !== "png" && ext !== "jpg" && ext !== "gif" && ext !== "jpeg") {
            return callback("Only images are allowed");
        }
        callback(null, true);
    };

    private storage =  multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public' + this.dir);
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + "-" + Date.now() + ".jpg");
        }
    });
    
    public upload = multer({ storage: this.storage , fileFilter : this.fileFilter });

    unlinkImange(dirImage: string){
        fs.unlink(dirImage,  (err) => console.log(err) );
    }  

}

