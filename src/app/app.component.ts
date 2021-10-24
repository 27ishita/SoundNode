import { Component } from '@angular/core';
import { BehaviorSubject, observable, Observable, Subject } from 'rxjs';
import * as moment from 'moment';
import { StreamState } from './interfaces/stream-state';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  audioObject = new Audio();
  audioEvent :any[] =[
  "ended",
  "error",
  "play",
  "playing",
  "pause",
  "timeupdate",
  "canplay",
  "loadedmetadata",
  "loadstart"]

  files = [{
    url : './assets/b99.mp3',
    name : 'Brooklyn nine nine'
  },
  {
    url : './assets/friends.mp3',
    name : 'Fiends theme song'
  },
  {
    url : './assets/tbbt.mp3',
    name : 'The big bang theory'
  },
  {
    url : './assets/Barsaat.mp3',
    name : 'Barsaat'
  },
  {
    url : './assets/Besabriyaan.mp3',
    name : 'Besabriyaan'
  },
  {
    url : './assets/Kho Gaye Hum Kahan.mp3',
    name : 'Kho Gaye Hum Kahan'
  },
  {
    url : './assets/Tere Hi Hum.mp3',
    name : 'Tere Hi Hum'
  }

  ];

  constructor(){

  }


  private state: StreamState = {
    playing: false,
    readableCurrentTime: '',
    readableDuration: '',
    duration: undefined,
    currentTime: undefined,
    volume: 0.5,
    canplay: false,
    error: false,
  };

  currentTime:any = '00:00:00';
  duration:any ='00:00:00';
  seek = 0;
  title: any;


  private stateChange: BehaviorSubject<StreamState> = new BehaviorSubject(
    this.state
  );


  private stop$ = new Subject();
  private resetState() {
    this.state = {
      playing: false,
      readableCurrentTime: '',
      readableDuration: '',
      duration: undefined,
      currentTime: undefined,
      volume: 0.5,
      canplay: false,
      error: false
    };
  }




  private updateStateEvents(event: Event): void {
    switch (event.type) {
      case "canplay":
        this.state.duration = this.audioObject.duration;
        this.state.readableDuration = this.timeformat(this.state.duration);
        this.state.canplay = true;
        break;
      case "playing":
        this.state.playing = true;
        break;
      case "pause":
        this.state.playing = false;
        break;
      case "timeupdate":
        this.state.currentTime = this.audioObject.currentTime;
        this.state.readableCurrentTime = this.timeformat(
          this.state.currentTime
        );
        break;
      case "error":
        this.resetState();
        this.state.error = true;
        break;
    }
    this.stateChange.next(this.state);
  }



  getState(): Observable<StreamState> {
    return this.stateChange.asObservable();
  }
  
  play()
  {
    this.audioObject.play();
  console.log('Clicked play');
  }

  pause()
  {
    this.audioObject.pause();
    console.log("pause")
  }
  stop()
  {
    this.audioObject.pause()
    this.audioObject.currentTime =0;
    console.log("stop")
  }

  timeformat(time:number,format:string="HH:mm:ss")
  {
      const momentTime = time*1000;
      return moment.utc(momentTime).format(format);
  }

  openSongs(url: string)
  {
   this.streamViewObserve(url).subscribe(event=>{})

    console.log(url)
  }


  setVolume(ev:any)
  {
    this.audioObject.volume = ev.target.value;
    console.log(ev.target.value);
  }

  streamViewObserve(url:string)
{
      return new Observable(Observable =>{

        this.audioObject.src = url;
        this.audioObject.load();
        this.audioObject.play();
       

        const handlerEvent = (event:Event)=>{
          console.log(event);
          this.currentTime = this.timeformat(this.audioObject.currentTime);
          this.duration = this.timeformat(this.audioObject.duration)
          this.seek = this.audioObject.currentTime;
         // this.updateStateEvents(event);
          //observable.next(event);
        }

        this.eventAdd(this.audioObject,this.audioEvent,handlerEvent)
        return ()=>{this.audioObject.pause();
                    this.audioObject.currentTime=0;
                  this.removeEvent(this.audioObject,this.audioEvent,handlerEvent)
                  }

      })
  }

  private eventAdd(obj:any,events:any[],handlerEvent:any)
  {
    events.forEach(event => {
      obj.addEventListener(event,handlerEvent);
      
    });
    
  }
  removeEvent(obj:any,events:String[],handlerEvent:any)
  {
    events.forEach(event => {
      obj.removeEventListener(event,handlerEvent);
      
    });
  }

  setSeekTo(e:any)
  {
    this.audioObject.currentTime= e.target.value;
  }
}
