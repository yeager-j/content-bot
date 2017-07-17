import ytdl from "ytdl-core";
import YouTube from "simple-youtube-api";
import YouTubeVideo from "../classes/youtube-video";
import * as secret from '../../secret.json';
import * as _ from 'underscore';

let instance = null;

export default class MusicManager {
    constructor() {
        if (!instance) {
            instance = this;
        }

        this._queue = [];
        this.dispatcher = null;
        this.connection = null;
        this.currentSong = null;
        this.message = null;
        this.yt = new YouTube(secret.youtube.api_key);

        return instance;
    }

    async setUpVideo(message, query) {
        this.message = message;

        if (!message.member.voiceChannel) {
            this.respond('You need to join a voice channel, ya dingus!');
            return;
        }

        try {
            let results = await this.yt.searchVideos(query);
            let song = new YouTubeVideo(results[0], message);
            this.connection = await message.member.voiceChannel.join();
            this.addToQueue(song);
            if (!this.currentSong) {
                await this.play(song);
            }
        } catch (e) {
            this.respond('Unable to play song for some dumbass reason.');
            console.log(e);
        }
    }

    async play(song) {
        this.currentSong = song;
        this.respond(`Playing ${song.title} \n \n**Requested By** ${song.requestedBy}`);

        let stream = ytdl(`http://youtube.com/watch?v=${song.video.id}`, { audioonly: true });
        this.dispatcher = this.connection.playStream(stream)
            .on('end', () => {
                this.queue.shift();

                if (this.queue.length > 0) {
                    setTimeout(() => this.play(this.queue[0]), 400);
                } else {
                    this.respond('Reached the end of the queue. Peace out, y\'all.');
                    this.currentSong = null;
                    this.connection.disconnect();
                }
            });
    }

    addToQueue(song) {
        this.respond(`Added ${song.title} to the queue.`);
        this.queue.push(song);
    }

    skip() {
        if (this.currentSong && this.queue.length > 1) {
            this.respond(`Skipping ${this.currentSong.title}`);
            this.dispatcher.end();
        } else if (this.queue.length === 1) {
            this.respond('The queue is empty! Stopping...');
            this.stop();
        } else {
            this.respond('There isn\'t a video playing!');
        }
    }

    pause() {
        this.dispatcher.pause();
    }

    resume() {
        this.dispatcher.resume();
    }

    stop() {
        if (this.currentSong) {
            this.queue = [];
            this.dispatcher.end();
            this.currentSong = null;
        }
    }

    respond(response) {
        if (this.message) {
            this.message.channel.send(response);
        }
    }

    shuffle() {
        let clone = this.queue.slice();
        clone.splice(0, 1);
        clone = _.shuffle(clone);

        let newArr = [this.queue[0]];
        clone.forEach(c => newArr.push(c));
        this.respond('Shuffled the queue!');

        this.queue = newArr;
    }

    get queue() {
        return this._queue;
    }

    set queue(value) {
        this._queue = value;
    }
};
