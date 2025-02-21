import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ThemeSwitcher = () => {
  const { setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const themes = [
    { name: "Red", value: "red", color: "#ff0000" },
    { name: "Black", value: "black", color: "#000000" },
    { name: "Royal Blue", value: "royalBlue", color: "#4169e1" },
    { name: "Green", value: "green", color: "#008000" },
    { name: "Purple", value: "purple", color: "#800080" },
    { name: "Orange", value: "orange", color: "#ffa500" },
    { name: "Pink", value: "pink", color: "#ffc0cb" },
    { name: "Teal", value: "teal", color: "#008080" },
  ];

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setOpen(true)}>Change Theme</Button>
        </DialogTrigger>
        <DialogContent>
          <div className="grid grid-cols-2 gap-4">
            {themes.map((theme) => (
              <button
                key={theme.value}
                onClick={() => {
                  setTheme(theme.value);
                  setOpen(false);
                }}
                className="p-4 rounded-full"
                style={{ backgroundColor: theme.color, color: "#ffffff" }}
              >
                {theme.name}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ThemeSwitcher;
