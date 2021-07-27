# CJ Flashy Slideshow

Copyright (c) 2011 Creative Juices Bo. Co.  
Written by: Doug Jones ([www.cjboco.com](https://cjboco.com))  
Licensed under the MIT.  

View [online demo](http://cjboco.github.io/CJ-Flashy-Slideshow/).

## A jQuery Plugin That Gives Your Slide Shows Some Flash-Like Transitions



### Project Description 
CJ Flashy Slide Show is a JQuery plugin that allows you to create a photo slide show that has some "flash-like" transitional effects. The plugin has various settings which you can manipulate to achieve a multitude of effects, such as sizing, timing, transparency and shape style. Integration is a snap, you basically create a set of images and wrap it within a simple container. Unlike most Flash solutions you do not need to create an external XML file or embed your images within a hard-to-change Flash project.

This version is identical to CJ Flashy Slide Show 1.1.2, accept I've now added a variety of pre-defined presets. You still can pass the old variables to the code if you like, but I've noticed that I may have made things a little too complicated for a few users. This is my attempt to simplify things. If you would like to make your own presets or play around the various options, take a look at that version to see what all the options are.

### Requirements 
CJ Flashy Slide Show requires JQuery 1.7.0 or greater. This version is using the new .off() and .on() event delegation methods, which requires at least version 1.7 of jQuery. In theory, you could change these methods to .bind() and the plug-in should work in older versions.

### Implementing 

#### Header Includes 
Getting CJ Flashy Slide Show to work is really quite simple. The first thing you are going to need to do is include the jquery.cj-flashy-slideshow.js file after your call to include JQuery. This is done in the header area of your web page. Typically you will do something like this:

```
<script src="jquery.min.js" type="text/javascript"></script>
<script src="jquery.cj-flashy-slideshow.js" type="text/javascript"></script>
```

Next, you will need to have a block container that contains a single or group of images. I've added line breaks <br> in my example, but it is not neccessary. I do this so the page looks somewhat presentable for any user who may not have a JavaScript or CSS capable web browser.

#### HTML 
An important note about setting the image dimensions. The plugin will basically ignore the image width and height settings. So you need to make sure that your images are scaled and cropped exactly how you want them to display within the container. I might revisit this in a later version of the plug-in, but for now just make sure all your images are the same size.

Here's an example of what a container might look like. This code would be placed somewhere withing your web page's <body> section.

```
<div id="example">
    <img src="image_a.jpg" /><br />
    <img src="image_b.jpg" />
</div>
```

#### CSS 
We now have to apply some CSS rules to our container. Nothing to fancy or complicated, just a few key elements that are going to be required by the plugin. You need to set the position of the block to either relative or absolute. Also you need to be sure to set the width and the height, as well has making sure that any overflow is hidden. The second rule is not required, but just to be sure, I've hidden all the line-breaks.

```
div#example {
	position: relative;
	display: block;
	width: 250px;
	height: 150px;
	overflow: hidden;
}

div#example br {
	display: none;
}
```

#### Initiating the Script
To get the slide show started, with the default preset (bricks) all you have to do is initiate the script like this:

```
<script type="text/javascript"><!--
(function ($) {
	$('#example').cjFlashySlideShow();
}(jQuery));
//-->
</script>
```

... or if you want to pass along one of the predefined presets, you would do something like this:

```
<script type="text/javascript"><!--
(function ($) {
	$('#example').cjFlashySlideShow({
		preset: "cubism"
	});
}(jQuery));
//-->
</script>
```

### Presets
Below is a list of all the currently available presets. If you would like to create additional presets, post what you have in the comments below. I'll gladly give you credit!

| Preset        |  Description                                                                     |  Default  |
| ------------- | -------------------------------------------------------------------------------- | --------- |
| bricks        | Little bricks drop in from the top and expand to reveal the underlying image.    | Yes       |
| cubism        | Random transparent blocks fly in from all sides to reveal the underlying image.  | No        |
| rain          | Small rain drops fall from the top and expand to reveal the underlying image. *This preset only works in browsers which supports CSS3 rules.   | No        |
| blinds        | Evenly spaced and sized horizontal bands expand to reveal the underlying image.  | No        |
| blinds2       | Evenly spaced and sized vertical bands expand to reveal the underlying image.    | No        |
| transport     | Random transparent horizontal bands expand to reveal the underlying image.       | No        |
| transport2    | Random transparent vertical bands expand to reveal the underlying image.         | No        |
