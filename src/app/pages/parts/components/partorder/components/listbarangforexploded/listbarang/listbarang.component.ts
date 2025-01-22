import { Component, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ListBarangService } from './listbarang.service';
import { GlobalState } from '../../../../../../../global.state';

@Component({
  selector: 'list-barang',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './listbarang.html',
  styleUrls: ['./listbarang.scss']
})
export class ListBarang {

  baranglist: any;
  explodedheaderlist: any;
  explodeddetaillist: any;
  selectedBarang: any;
  selectedExplodedheader: any;
  selectedExplodeddetail: any;
  selectedExplodeddetail2: any;
  KodeBass: any;
  selectedBarang2: any;
  display: boolean = false;
  display2: boolean = false;
  display3: boolean = false;
  mouseWheelDir: string = '';
  widthsize: number = 480;
  heightsize: number = 480;
  gambar: any;
  gambarori: any;
  img2 = new Image();

  @Output() BarangdataOutput = new EventEmitter<String>();
  @Input() componentDisableBarang = false;

  constructor(protected service: ListBarangService,
    private route: ActivatedRoute,
    private router: Router, public global: GlobalState) {

    this.KodeBass = this.global.Decrypt('mAuth').KODE_BASS

  }


  draw(scale, translatePos, gambar) {
    var canvas = <HTMLCanvasElement>document.getElementById("myCanvas");
    var context = canvas.getContext("2d");

    this.img2.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      context.save();
      context.translate(translatePos.x, translatePos.y);
      context.scale(scale, scale);

      context.drawImage(this.img2, 0, 0, 480, 480);
    };

    this.img2.src = this.gambar;

    context.restore();
  }


  initialize(gambar) {
    var canvas = <HTMLCanvasElement>document.getElementById("myCanvas");

    var translatePos = {
      x: 0,
      y: 0
    };

    var scale = 1;
    // var scale = 1.0;
    var scaleMultiplier = 1.2;
    var scaleMultiplier2 = 1.1;
    var startDragOffset = { x: 0, y: 0 };
    var mouseDown = false;

    // var scaleFactor = 1.1;

    // var zoom = function(clicks){
    //   var factor = Math.pow(scaleFactor,clicks);
    //   this.draw(factor, translatePos, gambar);
    // }
    var self = this;
    var handleScroll = function (evt) {
      if (!evt) evt = event;
      var direction = (evt.detail < 0 || evt.wheelDelta > 0) ? -1 : 1;

      if (direction < 0) {
        scale *= scaleMultiplier2;
        if (scale < 3) {
          self.draw(scale, translatePos, gambar);
        } else {
          scale = 3;
          self.draw(scale, translatePos, gambar);
        }
      } else {
        scale /= scaleMultiplier2;
        if (scale > 1) {
          translatePos.x = 0;
          translatePos.y = 0;
          self.draw(scale, translatePos, gambar);
        } else {
          scale = 1;
          translatePos.x = 0;
          translatePos.y = 0;
          self.draw(scale, translatePos, gambar);
        }
      }
      return evt.preventDefault() && false;
    };

    canvas.addEventListener('DOMMouseScroll', handleScroll, false);

    canvas.addEventListener("mousewheel", (evt) => {
      if (evt.deltaY < 0) {
        scale *= scaleMultiplier;
        // console.log(scale)
        if (scale < 3) {
          this.draw(scale, translatePos, gambar);
        } else {
          // console.log(scale)
          scale = 3;
          this.draw(scale, translatePos, gambar);
        }
      } else {
        scale /= scaleMultiplier;
        if (scale > 1) {
          translatePos.x = 0;
          translatePos.y = 0;
          this.draw(scale, translatePos, gambar);
        } else {
          scale = 1;
          translatePos.x = 0;
          translatePos.y = 0;
          this.draw(scale, translatePos, gambar);
        }
      }
      evt.preventDefault();
    }, false);

    // add event listeners to handle screen drag
    canvas.addEventListener("mousedown", (evt) => {
      mouseDown = true;
      startDragOffset.x = evt.clientX - translatePos.x;
      startDragOffset.y = evt.clientY - translatePos.y;
    }, false);

    canvas.addEventListener("mouseup", (evt) => {
      mouseDown = false;
    }, false);

    canvas.addEventListener("mouseover", (evt) => {
      mouseDown = false;
    }, false);

    canvas.addEventListener("mouseout", (evt) => {
      mouseDown = false;
    }, false);

    canvas.addEventListener("mousemove", (evt) => {
      if (mouseDown) {
        translatePos.x = evt.clientX - startDragOffset.x;
        translatePos.y = evt.clientY - startDragOffset.y;
        this.draw(scale, translatePos, gambar);
      }
    }, false);

    this.draw(scale, translatePos, gambar);
  };

  onRowSelectBarang(event) {
    this.display = false;
    this.display2 = true;

    this.service.getExplodedHeaderList(this.selectedBarang.Kode_Barang.trim()).then(
      data => this.explodedheaderlist = data
      , err => console.log(err)
    );
  }

  onRowSelectExplodedHeader(event) {
    this.display2 = false;
    this.display3 = true;

    this.service.getExplodedDetailList(this.selectedExplodedheader.ExplodedID.trim()).then(
      data => this.explodeddetaillist = data
      , err => console.log(err)
    );

    this.service.getExplodedImage(this.selectedExplodedheader.ExplodedID.trim()).then(
      data => {
        this.gambar = '';
        this.gambar = 'data:image/png;base64,' + data;

        this.initialize(this.gambar);
      }
      , err => console.log(err)
    );
  }

  browseBarangExploded() {
    this.service.getBarangList().then(
      data => this.baranglist = data
      , err => console.log(err)
    );

    this.display = true;
  }

  addtogrid() {
    this.selectedExplodeddetail2 = [];
    if (this.selectedExplodeddetail == undefined) {
      alert('Barang belum di pilih')
    } else {
      this.service.getStockSelect(this.selectedExplodeddetail, this.KodeBass.trim())
        .then(data => {
          Promise.all(data.map((detail, index) => {
            this.selectedExplodeddetail2.push({ Part_ID: detail.Part_ID, Part_Name: this.selectedExplodeddetail[index].PartName, QUANTITY: 1, STOCK_CABANG: detail.Stock_Cabang, STOCK_PUSAT: detail.Stock_Pusat, Harga: this.selectedExplodeddetail[index].Harga });
            // this.service.pushData(this.selectedExplodeddetail2[index])
            this.BarangdataOutput.emit(this.selectedExplodeddetail2[index])
          })
          )
          this.selectedBarang = [];
          this.selectedExplodedheader = [];
          this.selectedExplodeddetail = [];
          this.selectedExplodeddetail2 = [];
        }
        )

      this.display3 = false;
    }
  }

  Back() {
    this.display = false;
    this.display2 = false;
    this.display3 = false;

    this.selectedBarang = [];
    this.selectedExplodedheader = [];
    this.selectedExplodeddetail = [];
    this.selectedExplodeddetail2 = [];
    this.gambar = '';
    this.initialize(this.gambar)
  }

}
