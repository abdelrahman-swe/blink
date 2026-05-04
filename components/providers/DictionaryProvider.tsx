"use client";
import React, { createContext, useContext } from 'react';

type DictionaryData = Record<string, any>;

const DictionaryContext = createContext<DictionaryData | null>(null);

export function DictionaryProvider({
    children,
    dictionaries
}: {
    children: React.ReactNode,
    dictionaries: DictionaryData
}) {
    return (
        <DictionaryContext.Provider value={dictionaries}>
            {children}
        </DictionaryContext.Provider>
    );
}

export function useDictionary() {
    const context = useContext(DictionaryContext);
    if (!context) {
        return {} as DictionaryData; 
    }
    return context;
}
