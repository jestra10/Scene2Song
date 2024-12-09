import React from "react";
import { ReactElement, Fragment, useState } from "react";
import '../styles/Song.css'

interface SongProps {
    title: string;
    artist: string;
    url: string;
}

interface SongListProps {
    songs: SongProps[];
}

export function Song(props: SongProps) {
    return (
        <div className="song">

            <div><a href={props.url} target="_blank" rel="noopener noreferrer">
                {props.title}
            </a></div>
            <div>{props.artist}</div>
        </div>
    );
}

export function SongList(props: SongListProps) {
    return (
        <div className="song-list">
            {props.songs.map((song, index) => (
                <Song
                    key={index} // Use a unique key for React's reconciliation
                    title={song.title}
                    artist={song.artist}
                    url={song.url}
                />
            ))}
        </div>
    );
}