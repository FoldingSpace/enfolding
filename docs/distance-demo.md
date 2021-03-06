# Distance Demo
![Distance 0 in Color](../graphics/distance-tutorial/pinch-color.png)
## Getting Started
_enfolding_ allows you to change the distances between two nodes within the editing canvas. This will create a pinch on the maps surface according to the distance you enter. In the image above, with a new edge distance of 0, the two corners are completely cinched together. Here, we will walk you through how to adjust distances and finish with a geographic example from NACIS 2016. A more technical explanation is to come. 
### Add an image to _enfolding_ + create a grid
Here, we are working with a simple grey grid image. Drag and drop whatever image or map you would like to work with into the editing canvas. Add a grid of your choice.
![Add map grid](../graphics/distance-tutorial/add-map-grid.png)
### Create two nodes that connect where you would like to adjust the distance
Create two nodes to get started. You are not limited to just two nodes, but for this example, we are using two.
![Nodes-triangles](../graphics/distance-tutorial/nodes-triangles.png)
### Working with the inputs
Be sure to check "show inputs" so that the edge distances appear. All distances are recorded in pixels. Type a new distance in the text box, then hit enter. Swap over to the rendering canvas to see your changes in 2D and 3D. You can always switch back to edit mode and enter new distances in order to adjust your visualization. 
### Overview
Here is a brief overview of the process before we jump into a geographic example.
![change-distance](../graphics/distance-tutorial/change-distance.gif)

## Example: Getting to NACIS 2016
How do different modes of transportation shape relations across space?
### Add image and grid
![nacis-2016](../graphics/distance-tutorial/grids.png)
### Create nodes and connections between airports
Here we compare the driving route to flight paths from Madison, WI to Colorado Springs. The driving path is symbolized in black, while the flight path is created through new nodes within enfolding. This specific path transports passengers from Madison to Dallas and then back north to Colorado Springs. After laying out a basic grid, we add a number of nodes to connect these airports and examine their original distances. 
![nacis-2016](../graphics/distance-tutorial/nodes.png)
### Adjust distances
Driving time from Madison to Colorado Springs averages around 15 hours, and flight time totals around 4.5 hours in the selected route. We add an extra 2 hours to account for airport waiting and decrease the node distances to reflect the difference between driving and flight times, cinching together the three airport hubs. 
![nacis-2016](../graphics/distance-tutorial/inputs.png)
### Display in render canvas
**Here’s how the image changes in 2D with the new distances.**
![nacis-2016](../graphics/distance-tutorial/2-D.jpg) 
**Here’s how it changes in 3D as relations get scaled.**
![nacis-2016](../graphics/distance-tutorial/nacis-2016.jpg) 
### View wireframe
![wireframe-peaks](../graphics/distance-tutorial/wireframe-peaks.jpg)
#### Add route lines in external program
![nacis-2016-with-line](../graphics/distance-tutorial/nacis-2016-with-line.png)

#### Map tiles used for image by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL.


### Additional grey grid renders
Here are a few extra renders from the grey grid example. 
#### 2D render with no distance changes
The new nodes cause the corners to slightly fold even in the 2D view.
![2D-normal](../graphics/distance-tutorial/2D-normal.png)
#### 2D render with distance set to zero
Notice how this changes when distance is drastically decreased, creating intense folds.
![2D-pinch](../graphics/distance-tutorial/2D-pinch.png)
#### 3D render with no distance changes
![3D-normal](../graphics/distance-tutorial/3D-normal.png)
#### 3D render with distance set to zero
In the 3D render, these distance changes reflect in folding, curling or pinching of the image's surface. 
![3D-pinch](../graphics/distance-tutorial/3D-pinch.png)
#### Zero distance alternative view
Use the rotate feature or your mouse to move the graphic around and export alternate 3D views. 
![3D-view](../graphics/distance-tutorial/3D-view.png)
