import { Component, OnInit } from '@angular/core';
import { MapService, Zone } from './services/map.service';

declare var google: any;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  map: any;
  drawingManager: any;
  textInput: any;
  colorInput: any;
  Markers: any = [];
  Marker: any;
  newShape: any;
  ShapePath: any;
  lat: any;
  lng: any;
  Coords: any;
  showPopup = false;
  zonePoints: any = [];
  input: any;
  zoneDetails: Zone;
  shapes: any = [];
  testShape: any;
  shapesCoords: any = [];
  screenHeight: number;
  constructor(private mapService: MapService) {
    this.zoneDetails = {
      label: '',
      color: '',
      points: [],
    }

    this.screenHeight = window.innerHeight;
  }

  ngOnInit(): void {
    this.getZones();
    this.initMap();
  }

  getZones(): void {
    this.mapService.getZones().subscribe((response: any) => {
      console.log('getZones => ', response);
      if (response.message === 'success' && response.data.length > 0) {
        this.shapesCoords = response.data;
        this.myDrawer(this.shapesCoords);
        // response.data.forEach((element: any) => {
        //   this.deleteZone(element._id);
        // });
      }
    })
  }

  createZone(zone: Zone): void {
    this.mapService.createZone(zone).subscribe((data) => {
      console.log('zone => ', data);
      this.newShape.setMap(null);
      window.location.reload();
    })
  }

  updateZone(zoneId: string, zone: Zone): void {
    this.mapService.updateZone(zoneId, zone).subscribe((response) => {
      console.log('response => ', response);
    })
  }

  deleteZone(zoneId: string): void {
    this.mapService.deleteZone(zoneId).subscribe((response) => {
      console.log('response => ', response);
    })
  }

  initMap() {
    this.map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 30.397, lng: 30.644 },
      zoom: 8,
    });

    this.drawingManager = new google.maps.drawing.DrawingManager({
      // drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_LEFT,
        drawingModes: [google.maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: {
        editable: true,
        fillColor: "",
        fillOpacity: 0.35,
        clickable: true,
      }
    });

    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event: any) => {
      this.newShape = event.overlay;
      this.newShape.type = event.type;

      this.shapes.push(this.newShape)
      this.shapes.forEach((drawenShape: any) => {
        this.ShapePath = drawenShape.getPath().getArray();

        for (let i = 0; i < this.ShapePath.length; i++) {
          this.lat = this.ShapePath[i].lat();
          this.lng = this.ShapePath[i].lng();
          this.Coords = { lat: this.lat, lng: this.lng };
          this.zonePoints.push(this.Coords);
          google.maps.event.addListener(this.newShape, "click", (e: any) => {
            // Check if click was on a vertex control point
            if (e.vertex == undefined) {
              return;
            }
            deleteMenu.open(this.map, this.newShape.getPath(), e.vertex);
          });
        }

        this.textInput = '';
        this.colorInput = '';
        this.showPopup = true;
        class DeleteMenu extends google.maps.OverlayView {
          div_: any;
          divListener_: any;
          constructor() {
            super();
            this.div_ = document.createElement("div");
            this.div_.className = "delete-menu";
            this.div_.innerHTML = "Delete Point";

            const menu = this;

            google.maps.event.addDomListener(this.div_, "click", () => {
              menu.removeVertex();
            });
          }
          onAdd() {
            const deleteMenu = this;
            const map = this.getMap();

            this.getPanes().floatPane.appendChild(this.div_);
            // mousedown anywhere on the map except on the menu div will close the
            // menu.
            this.divListener_ = google.maps.event.addDomListener(
              map.getDiv(),
              "mousedown",
              (e: any) => {
                if (e.target != deleteMenu.div_) {
                  deleteMenu.close();
                }
              },
              true
            );
          }
          onRemove() {
            if (this.divListener_) {
              google.maps.event.removeListener(this.divListener_);
            }

            this.div_.parentNode.removeChild(this.div_);
            // clean up
            this.set("position", null);
            this.set("path", null);
            this.set("vertex", null);
            this.set("marker", null)
          }

          close() {
            this.setMap(null);
          }
          draw() {
            const position = this.get("position");
            const projection = this.getProjection();

            if (!position || !projection) {
              return;
            }

            const point = projection.fromLatLngToDivPixel(position);

            this.div_.style.top = point.y + "px";
            this.div_.style.left = point.x + "px";
          }
          /**
           * Opens the menu at a vertex of a given path.
           */
          open(map: any, path: any, vertex: any) {
            this.set("position", path.getAt(vertex));
            this.set("path", path);
            this.set("vertex", vertex);
            this.setMap(map);
            this.draw();
            this.testShape.setMap(null)
          }
          /**
           * Deletes the vertex from the path.
           */
          removeVertex() {
            const path = this.get("path");
            const vertex = this.get("vertex");

            if (!path || vertex == undefined) {
              this.close();
              return;
            }

            path.removeAt(vertex);
            this.close();
          }
        }
        const deleteMenu = new DeleteMenu();
      })
    })

    this.drawingManager.setMap(this.map);

    this.map.addListener("zoom_changed", () => {
      console.log('a7aa');

      this.getZones();
    });

  }

  myDrawer(shapes: any) {
    shapes.forEach((shape: any) => {

      let points = shape.points.map((item: any) => {
        let latLng = { lat: +item.lat, lng: +item.lng };
        return latLng;
      });

      const bermudaTriangle = new google.maps.Polygon({
        paths: [points],
        strokeColor: shape.color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: shape.color,
        fillOpacity: 0.35,
        clickable: true
      });
      bermudaTriangle.setMap(this.map);
    })
  }

  drawShape(points: any, color: any) {
    if (this.newShape.setMap(this.map)) {
      this.testShape = new google.maps.Polygon({
        paths: points,
        strokeColor: color,
        strokeOpacity: 0.5,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.5,
      })
      this.testShape.setMap(this.map);
    } else if (this.newShape.setMap(null)) {
      this.testShape.setMap(null);
    }
  }

  addZone() {
    this.zoneDetails = {
      label: this.textInput || 'zone',
      color: this.colorInput || '#000000',
      points: this.zonePoints
    }
    if (this.textInput != "") {
      this.showPopup = false;
      this.drawShape(this.zonePoints, this.colorInput);
      this.createZone(this.zoneDetails);
    }
    else {
      this.showPopup = true;
    }
  }
}


