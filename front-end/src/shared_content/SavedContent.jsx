import { createContext, useContext, useState } from "react";

const SavedContext = createContext(null);

export function SavedContent({ children }) {
    const [savedItems, setSavedItems] = useState([]);

    const sameId = (a, b) => String(a) === String(b);

    const isSaved = (id) => savedItems.some((item) => sameId(item.id, id));

    const addSaved = (hotel) => {
        setSavedItems((savedList) =>
            savedList.some((item) => sameId(item.id, hotel.id)) ? savedList : [...savedList, hotel]
        );
    };

    const removeSaved = (id) => {
        setSavedItems((savedList) => savedList.filter((item) => !sameId(item.id, id)));
    };

    const toggleSaved = (hotel) => {
        if (isSaved(hotel.id)) {
            removeSaved(hotel.id);
        } else {
            addSaved(hotel);
        }
    };

    const updateDescription = (id, newDescription) => {
        setSavedItems((savedList) =>
            savedList.map((item) =>
                sameId(item.id, id) ? { ...item, description: newDescription } : item
            )
        );
    };

    return (
    <SavedContext.Provider value={{ savedItems, isSaved, toggleSaved, removeSaved, updateDescription }}>
        {children}
    </SavedContext.Provider>
    );
}

export function useSaved() {
    const context = useContext(SavedContext);
    if (!context) {
        throw new Error("useSaved must be used inside <SavedContent>");
    }
    return context;
}