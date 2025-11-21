# 🧵 Fabric Calculator for Quilters & Sewers

A simple, mobile-friendly web calculator that helps quilters and sewers calculate fabric requirements for projects and discover what they can make with their existing fabric stash.

## ✨ Features

### 📏 Project → Fabric Calculator
- Select a project type (quilt, tote bag, pillowcase, etc.)
- Enter your desired dimensions
- Get instant calculations for:
  - Yards of fabric needed
  - Number of Jelly Roll strips (2.5")
  - Fat quarters needed
  - Difficulty level

### 🎨 Fabric → Projects Calculator
- Enter how much fabric you have (yards, strips, fat quarters, or charm squares)
- Optionally specify what you want to make
- See all projects you can complete with your fabric
- Shows what you'd need for projects requiring more fabric

## 🎯 Included Projects

1. **Jelly Roll Rug** - Coiled fabric rug from 2.5" strips
2. **Strip Quilt** - Simple quilt from strips sewn together
3. **Basic Quilt** - Traditional quilt with fabric squares
4. **Tote Bag** - Reusable shopping or project tote
5. **Pillowcase** - Standard bed pillowcase (Standard/Queen/King)
6. **Table Runner** - Decorative table runner
7. **Baby Quilt** - Perfect for babies and toddlers (3 sizes)
8. **Throw Pillow** - Decorative pillow cover

## 🚀 How to Use

### Opening the Calculator

1. **Double-click** `index.html` to open it in your web browser
2. Or **right-click** → "Open with" → choose your browser

### Using Project → Fabric

1. Click the "Project → Fabric" tab
2. Select your project type from the dropdown
3. Enter the dimensions (width, length, diameter, etc.)
4. Click "Calculate Fabric Needed"
5. See your results!

### Using Fabric → Projects

1. Click the "Fabric → Projects" tab
2. Choose your fabric type (yards, strips, fat quarters, or charm squares)
3. Enter how much you have
4. Optionally select a specific project you want to make
5. Click "Find Projects"
6. See what you can make!

## 📱 Mobile Friendly

This calculator works great on phones and tablets! Take it with you when fabric shopping to make quick calculations.

## 🛠️ How to Customize (For Learning!)

Since you're new to coding, here are some easy ways to customize the calculator:

### Adding a New Project

Open `script.js` and find the `projects` object (around line 10). Add your project like this:

```javascript
'my-new-project': {
    name: 'My New Project',
    description: 'What this project is',
    difficulty: 'Beginner', // or 'Intermediate' or 'Advanced'
    dimensions: [
        { id: 'width', label: 'Width (inches)', type: 'number', min: 10, default: 20 }
    ],
    calculate: (inputs) => {
        const width = inputs.width || 20;
        const yardsNeeded = (width / 36).toFixed(2); // Your calculation here

        return {
            yards: yardsNeeded,
            fatQuarters: Math.ceil(yardsNeeded / 0.5),
            projectSize: `${width}" wide project`
        };
    }
}
```

Then add it to the dropdown in `index.html` (around line 35):
```html
<option value="my-new-project">My New Project</option>
```

### Changing Colors

Open `styles.css` and look for these color codes:
- `#8b5cf6` - Main purple color
- `#6b21a8` - Dark purple for headings
- Change these to any color you like! (Try searching "color picker" on Google)

### Adjusting the Waste Buffer

In `script.js`, find this line near the top:
```javascript
const WASTE_BUFFER = 1.10; // 10% buffer
```

Change `1.10` to:
- `1.15` for 15% buffer
- `1.20` for 20% buffer
- etc.

## 📐 Technical Details

- **Fabric Width**: Assumes standard 44" wide quilting cotton
- **Waste Buffer**: Includes 10% extra for mistakes and waste
- **Fat Quarter**: Calculated as 0.5 yards (18" × 22")
- **Jelly Roll Strip**: 2.5" wide × 44" long
- **Charm Square**: 5" × 5"

## 🎓 Learning Resources

Since you're new to coding, here are the files and what they do:

- **index.html** - The structure of the page (what elements appear)
- **styles.css** - How everything looks (colors, spacing, fonts)
- **script.js** - The brains (calculations and interactivity)

### Want to Learn More?

- [HTML Tutorial](https://www.w3schools.com/html/)
- [CSS Tutorial](https://www.w3schools.com/css/)
- [JavaScript Tutorial](https://www.w3schools.com/js/)

## 🐛 Having Issues?

Common problems:
- **Calculator not working?** Make sure all three files are in the same folder
- **Styles not showing?** Refresh your browser (Ctrl+F5 or Cmd+Shift+R)
- **Changed code but nothing happened?** Clear your browser cache

## 📝 Future Ideas

Want to add more features? Here are some ideas:
- Add photos/thumbnails for each project
- Include metric measurements (meters/centimeters)
- Save favorite projects
- Print-friendly results page
- Backing and batting calculator
- Border calculator for quilts

## 💖 Have Fun!

Happy quilting and sewing! Feel free to modify this calculator to fit your needs. The best way to learn coding is by experimenting!

---

Made with 💜 for quilters and sewers everywhere
