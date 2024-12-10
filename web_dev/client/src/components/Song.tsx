import React from "react";
import { ReactElement, Fragment, useState } from "react";
import '../styles/Song.css'
import { SongProps } from './App.tsx'

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
                    title={song.title}
                    artist={song.artist}
                    url={song.url}
                />
            ))}
        </div>
    );
}