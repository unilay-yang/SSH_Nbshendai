Ext.data.JsonP.theming({"title": "Theming", "guide": "<h1>Theming Ext JS</h1>\n<div class='toc'>\n<p><strong>Contents</strong></p>\n<ol>\n<li><a href='#!/guide/theming-section-1'>Requirements</a></li>\n<li><a href='#!/guide/theming-section-2'>Building a Custom Theme</a></li>\n<li><a href='#!/guide/theming-section-3'>Styling Your Application</a></li>\n<li><a href='#!/guide/theming-section-4'>Sharing a Theme Between Applications</a></li>\n</ol>\n</div>\n\n<p>Theming defines the visual motif of your application.\nA theme is a set of visual aspects that can be easily switched\nwithout affecting the basic functionality of your application\nsuch as base color, font family, borders, backgrounds,\nand other CSS properties.\nTheming is differentiated from \"styling\"\nby the abilty to flip a switch and change the theme.</p>\n\n<p>Ext JS 4.2 includes an overhaul of the theming system\nthat makes it much easier to customize\nthe look and feel of an application.\nExt JS themes leverage\n<a href=\"http://sass-lang.com\">SASS</a> and <a href=\"http://compass-style.org\">Compass</a>\nwhich enable the use of variables and mixins in your stylesheets.\nAlmost all of the styles for Ext JS Components can now be customized,\nincluding colors, fonts, borders, and backgrounds, by simply changing SASS variables.</p>\n\n<p>Ext JS includes a default themes\nthat you can use as a base to create your own Custom Theme package\nthat can then be used in an Ext JS application.\nThis tutorial shows you how to create a custom theme\nthat is sharable between applications,\nhow to use that theme in an application,\nand how to create application-specific styling that is not shared.</p>\n\n<h2 id='theming-section-1'>Requirements</h2>\n\n<h3>Sencha Cmd 3.1</h3>\n\n<p>Sencha Cmd is a command-line tool\nused to package and deploy Ext JS and Sencha Touch applications.\nTo build a theme in Ext JS 4.2,\nyou must have Sencha Cmd 3.1 or higher installed on your computer.\nSencha Cmd 3.1 removes the need to have SASS and Compass installed on your computer\nsince it uses its own bundled version of SASS and Compass.</p>\n\n<p>For more information about installing and getting started with Sencha Cmd see\n<a href=\"#/guide/command\">Introduction to Sencha Cmd</a>.</p>\n\n<h3>Ruby</h3>\n\n<p><a href=\"http://www.ruby-lang.org\">Ruby</a>\nis an open source programming language\nthat is required to run Sencha Cmd.\nRefer to the <a href=\"#/guide/command\">Introduction to Sencha Cmd</a> guide for instructions on\ninstalling Ruby.</p>\n\n<h3>Ext JS</h3>\n\n<p>Custom themes are based on default themes that ship with the Ext JS SDK,\nso you will need to <a href=\"http://www.sencha.com/products/extjs/download/\">download Ext JS</a> 4.2 or later.\nUnzip the Ext JS development kit (SDK) to a location of your choosing.\nFor this tutorial,\nwe assume that you unzipped the SDK to your home directory: <code>\"~/extjs-4.2.0/\"</code></p>\n\n<h2 id='theming-section-2'>Building a Custom Theme</h2>\n\n<p>Now that we have installed the requirements for theme building,\nlet's get started creating a fully custom theme.</p>\n\n<h3>Set up the Workspace</h3>\n\n<p>The first step in building a custom theme\nis to set up your workspace using Sencha Cmd.\nRun the following from the command line,\nreplacing <code>\"~/ext-4.2.0\"</code> with the path\nwhere you unzipped the Ext JS SDK.</p>\n\n<pre><code>sencha -sdk ~/ext-4.2.0 generate workspace my-workspace\n</code></pre>\n\n<p>This creates a directory named <code>\"my-workspace\"</code>\nthat contains your custom theme package;\nyou will also create an application here that uses the new custom theme.\nThis command copies the Ext JS SDK and packages into your workspace\nso that the theme and application can find their required dependencies.\nThe commands for generating the theme and application\nmust be executed from inside the workspace directory\nso change your working directory to the new <code>\"my-workspace\"</code> directory now:</p>\n\n<pre><code>cd my-workspace\n</code></pre>\n\n<p>You should now see two directories inside your workspace</p>\n\n<ul>\n<li><code>\"ext\"</code> -- contains the Ext JS SDK</li>\n<li><code>\"packages\"</code> -- contains the Ext JS locale and theme packages</li>\n</ul>\n\n\n<h3>Generating an Application for Testing the Theme</h3>\n\n<p>Before creating a custom theme we need to set up a way to test the theme.\nThe best way to test a theme is to use it in an application.\nRun the following command from the <code>\"my-workspace\"</code> directory:</p>\n\n<pre><code>sencha -sdk ext generate app ThemeDemoApp theme-demo-app\n</code></pre>\n\n<p>This tells Sencha Cmd to generate an application named ThemeDemoApp\nin a new sub-directory named <code>\"theme-demo-app\"</code>,\nand to find the Ext JS SDK in the  <code>\"ext\"</code> directory\nthat was copied into <code>\"my-workspace\"</code> when the workspace was generated.\nNow let's build the app:</p>\n\n<pre><code>cd theme-demo-app\nsencha app build\n</code></pre>\n\n<p>There are two ways to run your app:</p>\n\n<ol>\n<li><strong>Development mode:</strong> simply open <code>\"theme-demo-app/index.html\"</code> in a browser.</li>\n<li><strong>Production mode:</strong> open <code>\"build/ThemeDemoApp/production/index.html\"</code> in a browser.</li>\n</ol>\n\n\n<p>We will use development mode for this tutorial\nsince it uses unminified source files for easy debugging.</p>\n\n<p>Production mode uses minified source files\nfor a smaller footprint and better performance\nfor the application.</p>\n\n<h3>Generating the Theme Package and File Structure</h3>\n\n<p>Sencha Cmd allows you to automatically generate the theme package and file structure.\nRun the following command from the theme-demo-app directory:</p>\n\n<pre><code>sencha generate theme my-custom-theme\n</code></pre>\n\n<p>This tells Sencha Cmd to generate a theme package\nnamed <code>\"my-custom-theme\"</code> in the current workspace.\nYou should see a newly created directory\nnamed <code>\"my-custom-theme\"</code> in the \"packages\" directory of your workspace.\nThis is the theme package.  Lets take a look at its contents:</p>\n\n<ul>\n<li><code>\"package.json\"</code> - This is the package properties file.  It tells Sencha Cmd certain things\nabout the package like its name, version, and dependencies (other packages that it requires).</li>\n<li><code>\"sass/\"</code> - This directory contains all of your theme's SASS files. The sass files are divided\ninto 3 main sections:\n\n<ol>\n<li><code>\"sass/var/\"</code> - contains SASS variables</li>\n<li><code>\"sass/src/\"</code> - contains SASS rules and UI mixin calls that can use the variables defined\nin \"sass/var/\"</li>\n<li><code>\"sass/etc/\"</code> - contains additional utility functions or mixins\nThe files in <code>\"sass/var/\"</code> and <code>\"sass/src\"</code> should be structured to match the class path of the\nComponent you are styling.  For example, variables that change the appearance of\n<a href=\"#!/api/Ext.panel.Panel\" rel=\"Ext.panel.Panel\" class=\"docClass\">Ext.panel.Panel</a> should be placed in a file named <code>\"sass/var/panel/Panel.scss\"</code>.</li>\n</ol>\n</li>\n<li><code>\"resources/</code>\" - contains images and other static resources that your theme\nrequires.</li>\n<li><code>\"overrides/\"</code> - contains any JavaScript overrides to Ext JS Component classes\nthat may be required for theming those Components.</li>\n</ul>\n\n\n<h3>Configuring Theme Inheritance.</h3>\n\n<p>All Sencha theme packages are part of a larger hierarchy of themes, and each theme package\nmust extend a base theme.  The next step in creating your custom theme is to figure out\nwhich theme to extend.  In the packages directory your workspace you will see the following\ntheme packages:</p>\n\n<ul>\n<li><code>\"ext-theme-base\"</code> - This package is the base theme for all other themes, and the only theme\npackage that does not have a parent theme.  It contains the bare minimum set of CSS rules\nthat are absolutely required for Ext JS Components and Layouts to work correctly.  The\nstyle rules in <code>\"ext-theme-base\"</code> are not configurable in a derived theme, and you should avoid\noverriding any of the style rules that are created by this theme.</li>\n<li><code>\"ext-theme-neutral\"</code> - The neutral theme extends <code>\"ext-theme-base\"</code>, and contains the vast\nmajority of configurable style rules.  Most of the variables that are available for\nconfiguring the appearance of Ext JS Components are defined in <code>\"ext-theme-neutral\"</code>.  These\nare the variables that can be overridden by your custom theme.</li>\n<li><code>\"ext-theme-classic\"</code> - The classic blue Ext JS theme.  Extends <code>\"ext-theme-neutral\"</code>.</li>\n<li><code>\"ext-theme-gray\"</code> - Gray theme. Extends <code>\"ext-theme-classic\"</code>.</li>\n<li><code>\"ext-theme-access\"</code> - Accessibility theme. Extends <code>\"ext-theme-classic\"</code>.</li>\n<li><code>\"ext-theme-neptune\"</code> - Modern borderless theme.  Extends <code>\"ext-theme-neutral\"</code>.</li>\n</ul>\n\n\n<p>So which theme should your custom theme extend?  We recommend using either <code>\"ext-theme-neptune\"</code>\nor <code>\"ext-theme-classic\"</code> as the starting point for custom themes.  The reason for this is\nbecause these themes contain all the code necessary for creating an attractive theme out\nof the box. The neutral theme should be thought of as a very abstract theme, and should not\ntypically need to be extended directly. Creating a custom theme by overriding <code>\"ext-theme-neutral\"</code>\nrequires hundreds of variable overrides and many hours of work, and should only be done\nby very advanced theme developers, whereas a derivation of neptune or classic theme can be up\nand running in minutes by simply changing a couple variables.  Additionally you can override\n<code>\"ext-theme-gray\"</code> or <code>\"ext-theme-access\"</code>\nif they provide a more desirable starting point for your custom theme.</p>\n\n<p>For this tutorial we will create a custom theme that extends the Neptune theme.  To do this,\nreplace the following line in <code>\"packages/my-custom-theme/package.json\"</code>:</p>\n\n<pre><code>\"extend\": \"ext-theme-classic\"\n</code></pre>\n\n<p>with this:</p>\n\n<pre><code>\"extend\": \"ext-theme-neptune\"\n</code></pre>\n\n<p>You now need to refresh your application.  This ensures that the correct theme JavaScript\nfiles are included in the application's <code>\"bootstrap.js\"</code> file so that the application can\nbe run in development mode.  Run the following command from the <code>\"theme-demo-app\"</code> directory.</p>\n\n<pre><code>sencha app refresh\n</code></pre>\n\n<h3>Configuring Global Theme Variables</h3>\n\n<p>Now that you have set up your theme package, its time to begin modifying the visual appearance\nof the theme.  Let's start by modify the base color from which many Ext JS Components'\ncolors are derived.  Create a file called Component.scss in \"my-custom-theme/sass/var/\".\nAdd the following code to the Component.scss file:</p>\n\n<pre><code>$base-color: #317040 !default;\n</code></pre>\n\n<p>Be sure to include <code>!default</code> at the end of all variable assignments if you want your\ncustom theme to be extensible. Without <code>!default</code> you will not be able to override the\nvariable in a derived theme, because Sencha Cmd includes variable files in \"reverse\" order -\nmost-derived theme first, base theme last.  For more information on the use of <code>!default</code> see\n<a href=\"http://sass-lang.com/docs/yardoc/file.SASS_REFERENCE.html#variable_defaults_\">Variable Defaults</a></p>\n\n<p>The value of $base-color must be a valid HTML color code;\nsee the <a href=\"http://html-color-codes.info\">HTML Color Codes</a> web page.</p>\n\n<p>For the complete list of Ext JS global SASS variables see <a href=\"#/api/Global_CSS\">Global_CSS</a>.</p>\n\n<h3>Building the Package</h3>\n\n<p>To generate a css file containing all the style rules for your theme, run the following\ncommand from the <code>\"packages/my-custom-theme/\"</code> directory:</p>\n\n<pre><code>sencha package build\n</code></pre>\n\n<p>Building the package generates a build directory in your theme package directory.\nInside <code>\"my-custom-theme/build/resources\"</code> you will find a file named <code>my-custom-theme-all.css</code>.\nThis file contains all the style rules for all Ext JS Components for your theme.  You can\nlink directly to this file from your app but this is not recommended because the <code>\"all\"</code>\nfile contains all styles for every Ext JS Component and most apps only use a subset of\nExt JS Components. Sencha Cmd has the ability to filter out unused CSS style rules when\nyou build an app, but first we need to configure the test app to use the custom theme.</p>\n\n<h3>Using a Theme in an Application</h3>\n\n<p>To configure your test application to use the custom theme that you just created,\nfind the following line in <code>theme-demo-app/.sencha/app/sencha.cfg</code></p>\n\n<pre><code>app.theme=ext-theme-classic\n</code></pre>\n\n<p>and replace it with:</p>\n\n<pre><code>app.theme=my-custom-theme\n</code></pre>\n\n<p>If you have already run a build of the app using the classic theme,\nyou should clean the build directory. From the theme-demo-app directory run:</p>\n\n<pre><code>sencha ant clean\n</code></pre>\n\n<p>Now from the <code>\"theme-demo-app\"</code> directory, run the following command to build the app:</p>\n\n<pre><code>sencha app build\n</code></pre>\n\n<p>Open <code>\"theme-demo-app/index.html\"</code> in a browser.  You should see the green color we specified\nearlier as <code>$base-color</code> applied to the components on the screen.</p>\n\n<h3>Configuring Component Variables</h3>\n\n<p>Each Ext JS Component has a list of global variables that can be used to configure its\nappearance.  Let's change the <code>font-family</code> of Panel Headers in <code>\"my-custom-theme\"</code>.  Create a\nfile named <code>\"packages/my-custom-theme/sass/var/panel/Panel.scss\"</code> and add the following\ncode:</p>\n\n<pre><code>$panel-header-font-family: Times New Roman !default;\n</code></pre>\n\n<p>Now build your app by running the following command from the <code>\"theme-demo-app\"</code> directory.</p>\n\n<pre><code>sencha app build\n</code></pre>\n\n<p>Open <code>\"theme-demo-app/index.html\"</code> in a web browser and you should see that the panel header\nuses \"Times New Roman\" font.</p>\n\n<p>You can find the complete list of SASS variables for each Component\nin the \"CSS Variables\" section of each page in the API docs.\nFor example, see <a href=\"#!/api/Ext.panel.Panel\" rel=\"Ext.panel.Panel\" class=\"docClass\">Ext.panel.Panel</a>\nand scroll down to the section titled \"CSS Variables\"</p>\n\n<h3>Creating Custom Component UIs</h3>\n\n<p>Every component in the Ext JS framework has a <code>ui</code> configuration (which defaults to \"<code>default</code>\").\nThis property can be configured on individual Component instances to give them a different\nappearance from other Component instances of the same type. This is used in the Neptune\ntheme to create different types of <a href=\"#!/api/Ext.panel.Panel\" rel=\"Ext.panel.Panel\" class=\"docClass\">Panels</a> and <a href=\"#!/api/Ext.button.Button\" rel=\"Ext.button.Button\" class=\"docClass\">Button</a>s.  For example panels with the 'default' UI have dark blue headers and panels with\nthe 'light' UI have light blue headers. Buttons use UIs to give toolbar buttons a different\nappearance from regular buttons.</p>\n\n<p>The ext-theme-neutral theme includes SASS mixins for many different Ext JS Components.\nYou can call these mixins to generate new UIs for Components.  Available mixins for each\nComponent are listed in the API Documentation. For example, see <a href=\"#!/api/Ext.panel.Panel\" rel=\"Ext.panel.Panel\" class=\"docClass\">Ext.panel.Panel</a>\nand scroll down to the \"CSS Mixins\" section to see what parameters the Panel UI mixin\naccepts. Let's use this mixin to create a custom Panel UI.  Create a file named\n<code>\"packages/my-custom-theme/sass/src/panel/Panel.scss\"</code> and add the following code to it:</p>\n\n<pre><code>@include extjs-panel-ui(\n    $ui-label: 'highlight-framed',\n    $ui-header-background-color: red,\n    $ui-border-color: red,\n    $ui-header-border-color: red,\n    $ui-body-border-color: red,\n    $ui-border-width: 5px,\n    $ui-border-radius: 5px\n);\n</code></pre>\n\n<p>This mixin call produces a new Panel UI named \"highlight-framed\" which has a red header\nbackground, red bordering, 5px border, and 5px border-radius. To use this UI, just configure\na Panel with \"highlight\" as its <code>ui</code> property (the \"-framed\" suffix is added to the UI of\na panel when you set the <a href=\"#!/api/Ext.panel.Panel-cfg-frame\" rel=\"Ext.panel.Panel-cfg-frame\" class=\"docClass\">frame</a> config to <code>true</code>).  Open\n<code>\"theme-demo-app/app/view/Viewport.js\"</code> and replace the items array with the following:</p>\n\n<pre><code>items: [{\n    // default UI\n    region: 'west',\n    xtype: 'panel',\n    title: 'West',\n    split: true,\n    width: 150\n}, {\n    // custom \"highlight\" UI\n    region: 'center',\n    xtype: 'panel',\n    layout: 'fit',\n    bodyPadding: 20,\n    items: [\n        {\n            xtype: 'panel',\n            ui: 'highlight',\n            frame: true,\n            bodyPadding: 10,\n            title: 'Highlight Panel'\n        }\n    ]\n}, {\n    // neptune \"light\" UI\n    region: 'east',\n    xtype: 'panel',\n    ui: 'light',\n    title: 'East',\n    split: true,\n    width: 150\n}]\n</code></pre>\n\n<p>Now build your app by running the following command from the <code>\"theme-demo-app\"</code> directory.</p>\n\n<pre><code>sencha app build\n</code></pre>\n\n<p>Open <code>\"theme-demo-app/index.html\"</code> in a web browser and you should see the red \"highlight\" panel\nin the center region.</p>\n\n<p>While UI mixins are a handy way to configure multiple appearances for a component, they\nshould not be overused.  Because each call to a UI mixin generates additional CSS rules,\ngratuitous calls to UI mixins can produce an overly large CSS file.</p>\n\n<p>Another important point to remember when calling UI mixins is to call the mixin by passing\nits named parameters, not an ordered list of parameter values.  Although SASS supports\nboth forms it's best to use this form:</p>\n\n<pre><code>@include extjs-component-ui(\n    $ui-foo: foo,\n    $ui-bar: bar\n);\n</code></pre>\n\n<p>And avoid this form:</p>\n\n<pre><code>@include extjs-component-ui(foo, bar);\n</code></pre>\n\n<p>The reason for this is, because of the complexity and number of mixin parameters, we cannot\nguarantee that the order will stay the same if new parameters are added, or if a deprecated\nparameter is removed.  It is therefore safest to always specify the parameters by name\nand not by ordinal names when calling UI mixins.</p>\n\n<h3>Modifying Image Assets</h3>\n\n<p>All required image assets are inherited from the parent theme by default, but in some cases you may need to override an image.  This can be easily done by placing the desired image\nin <code>\"my-custom-theme/resources/images/\"</code> and giving it the same name as the image it is\nintended to override. For example, let's change the info icon of the MessageBox component.\nSave the following image as <code>\"packages/my-custom-theme/resources/images/shared/icon-info.png\"</code></p>\n\n<p><p><img src=\"guides/theming/icon-info.png\" alt=\"Info Icon\"></p></p>\n\n<p>Now modify your test application to show a MessageBox that uses the custom icon. Add the\nfollowing items array to the highlight panel in your application's Viewport\n(<code>\"theme-demo-app/app/view/Viewport.js\"</code>):</p>\n\n<pre><code>...\ntitle: 'Highlight Panel',\nitems: [{\n    xtype: 'button',\n    text: 'Show Message',\n    handler: function() {\n        <a href=\"#!/api/Ext.MessageBox-event-show\" rel=\"Ext.MessageBox-event-show\" class=\"docClass\">Ext.Msg.show</a>({\n            title: 'Info',\n            msg: 'Message Box with custom icon',\n            buttons: <a href=\"#!/api/Ext.MessageBox-property-OK\" rel=\"Ext.MessageBox-property-OK\" class=\"docClass\">Ext.MessageBox.OK</a>,\n            icon: <a href=\"#!/api/Ext.MessageBox-property-INFO\" rel=\"Ext.MessageBox-property-INFO\" class=\"docClass\">Ext.MessageBox.INFO</a>\n        });\n    }\n}]\n...\n</code></pre>\n\n<p>And add <code><a href=\"#!/api/Ext.window.MessageBox\" rel=\"Ext.window.MessageBox\" class=\"docClass\">Ext.window.MessageBox</a></code> to the <code>requires</code> array of the Viewport:</p>\n\n<pre><code>requires: [\n    ...\n    '<a href=\"#!/api/Ext.window.MessageBox\" rel=\"Ext.window.MessageBox\" class=\"docClass\">Ext.window.MessageBox</a>',\n    ...\n],\n</code></pre>\n\n<p>Now build the app and view it in the browser;\nwhen you click the button you should see\na MessageBox containing the custom icon.</p>\n\n<h3>Slicing Images for CSS3 effects in IE</h3>\n\n<p>In many cases when creating new UI's, you will want to include background gradients or\nrounded corners. Unfortunately, legacy browsers do not support the CSS3 properties for these\neffects, so we must use images instead.  Sencha Cmd includes the ability to automatically\nslice these images for you.  To do this, we need to tell Sencha Cmd which Components need\nslicing.  The files that contain the slicing configuration are contained in the <code>\"sass/example/\"</code>\ndirectory of a theme.  To get an idea of what these files look like, let's look at the\n<code>\"packages/ext-theme-base/sass/example/\"</code> directory in your workspace:</p>\n\n<ul>\n<li><code>\"shortcuts.js\"</code> - This file contains the base configurations for the types of components\nthat can be sliced.  Most custom themes do not need to contain a <code>\"shortcuts.js\"</code> file;\nit is necessary only if your theme includes styling for custom Components.\nYour theme inherits all of the shortcuts defined in its base themes,\nand you can add additional shortcuts if needed by\ncalling <code>Ext.theme.addShortcuts()</code> in the <code>\"shortcuts.js\"</code> file in your theme.</li>\n<li><code>\"manifest.js\"</code> - This file contains the list of Component UIs for which sliced images\nwill be generated when you build your theme.  A theme inherits all manifest entries from\nits parent themes, and can add its own manifest entries by calling the\n<code>Ext.theme.addManifest()</code> function in its own <code>\"manifest.js\"</code> file.</li>\n<li><code>\"theme.html\"</code> - This is the file that renders the Components\ndefined in the <code>\"manifest.js\"</code> file. Sencha\nCmd renders <code>\"theme.html\"</code> in a headless WebKit browser, and takes a screenshot of the page.\nIt then uses this screenshot to slice the required images for displaying rounded corners\nand gradients in IE.</li>\n</ul>\n\n\n<p>To create slices for the rounded corners of the \"highlight\" panel UI that you created\nearlier in this tutorial, create a file named\n<code>\"packages/my-custom-theme/sass/example/manifest.js\"</code> and add the following code to it.</p>\n\n<pre><code>Ext.theme.addManifest(\n    {\n        xtype: 'panel',\n        ui: 'highlight'\n    }\n);\n</code></pre>\n\n<p>Now edit <code>\"packages/my-custom-theme/sass/example/theme.html\"</code> and add the following script\ntags:</p>\n\n<pre><code>&lt;!-- Required because Sencha Cmd doesn't currently add manifest.js from parent themes --&gt;\n&lt;script src=\"../../../ext-theme-neptune/sass/example/manifest.js\"&gt;&lt;/script&gt;\n&lt;!-- Your theme's manifest.js file --&gt;\n&lt;script src=\"manifest.js\"&gt;&lt;/script&gt;\n</code></pre>\n\n<p>That ensures that the UIs defined in ext-theme-neptune and my-custom-theme  get sliced\ncorrectly when you build the my-custom-theme package using <code>sencha package build</code>.\nYoull musst also add these 2 script tags to <code>\"theme-demo-app/sass/example/theme.html\"</code>,\nso that the UIs will get sliced when building the app using <code>sencha app build</code>:</p>\n\n<pre><code>&lt;script type=\"text/javascript\" src=\"../../../packages/ext-theme-neptune/sass/example/manifest.js\"&gt;&lt;/script&gt;\n&lt;script type=\"text/javascript\" src=\"../../../packages/my-custom-theme/sass/example/manifest.js\"&gt;&lt;/script&gt;\n</code></pre>\n\n<p>In the future, it will seldom be necessary to modify <code>\"theme.html\"</code> manually but,\nin Sencha Cmd 3.1.0, script tags\nfor <code>\"shortcuts.js\"</code> and <code>\"manifest.js\"</code> are not added automatically.</p>\n\n<p>That's all there is to it.  Now just build the demo app again, and run it in IE8 or below.\nYou should see rounded corners on the \"highlight\" panel that look just like the ones\ncreates using CSS3 when you run the app in a modern browser.</p>\n\n<h3>Theme JS Overrides</h3>\n\n<p>Sometimes a theme needs to change the appearance of some aspect of a Component that is\nonly configurable via JavaScript.  This can easily be accomplished by adding a JavaScript\noverride to your theme package.  To demonstrate how this is done, let's change the\n<a href=\"#!/api/Ext.panel.Panel-cfg-titleAlign\" rel=\"Ext.panel.Panel-cfg-titleAlign\" class=\"docClass\">titleAlign</a> config of Panels in the custom theme.\nCreate a new file named <code>\"packages/my-custom-theme/overrides/panel/Panel.js\"</code> and add\nthe following code:</p>\n\n<pre><code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>('MyCustomTheme.panel.Panel', {\n    override: '<a href=\"#!/api/Ext.panel.Panel\" rel=\"Ext.panel.Panel\" class=\"docClass\">Ext.panel.Panel</a>',\n    titleAlign: 'center'\n});\n</code></pre>\n\n<p>Now lets build the theme package so that <code>\"packages/my-custom-theme/build/my-custom-theme.js\"</code>\nwill include the new override.  From the <code>\"packages/my-custom-theme/\"</code> directory run:</p>\n\n<pre><code>sencha package build\n</code></pre>\n\n<p>You should now refresh the application so that the theme's JS overrides will get included\nwhen running the application in development mode.  Run the following command from the\n<code>\"theme-demo-app\"</code> directory:</p>\n\n<pre><code>sencha app refresh\n</code></pre>\n\n<p>Now build the app from the theme-demo-app directory:</p>\n\n<pre><code>sencha app build\n</code></pre>\n\n<p>Then open <code>\"theme-demo-app/index.html\"</code> in the browser. You should notice that all Panel\nheaders have centered titles.</p>\n\n<p>Although any Ext JS Component config can be overridden in this manner, best practice is\nto only use theme overrides to change those configs that directly affect the visual\nappearance of a Component.</p>\n\n<h3>The SASS Namespace</h3>\n\n<p>As described above, Sencha Cmd looks for files in <code>\"sass/var\"</code> and <code>\"sass/src\"</code> that match\nup with JavaScript classes. By default, for themes, the <code>Ext</code> namespace is assumed to be\nthe top-level namespace and so your theme would have a <code>\"sass/src/panel/Panel.scss\"</code> file\ncorresponding to <code><a href=\"#!/api/Ext.panel.Panel\" rel=\"Ext.panel.Panel\" class=\"docClass\">Ext.panel.Panel</a></code>.</p>\n\n<p>For a theme to apply outside the <code>Ext</code> namespace, you must change a config property\ncalled <code>package.sass.namespace</code> in <code>\".sencha/package/sencha.cfg\"</code>. To be able to style all\ncomponents in your theme, you will need to set this as blank:</p>\n\n<pre><code>package.sass.namespace=\n</code></pre>\n\n<p>With this set, the file you need to create to correspond with <code><a href=\"#!/api/Ext.panel.Panel\" rel=\"Ext.panel.Panel\" class=\"docClass\">Ext.panel.Panel</a></code>\nis <code>\"sass/src/Ext/panel/Panel.scss\"</code>.</p>\n\n<h3>Adding Custom Utility SASS</h3>\n\n<p>If your theme requires SASS functions or mixins that are not related to Component styling,\ne.g. utilities, these should be placed in the theme's <code>\"sass/etc\"</code> directory.  You can organize\nfiles in this directory however you like, but the only file that Sencha Cmd includes\nin the build is <code>\"sass/etc/all.scss\"</code>.\nAny other files must be imported by the <code>\"all.scss\"</code> file.\nFor an example that follows this pattern see <code>\"packages/ext-theme-base/sass/etc/\"</code>.</p>\n\n<h3>Migrating a Theme from Ext JS 4.1 or earlier.</h3>\n\n<p>In Ext 4.1, theming was done quite differently. Typically, all the SASS variables\nwould be placed in one <code>\"all.scss\"</code> file,\nand at the end of the file, the base theme's \"all.scss\" file would be imported.\nThe best starting point for migrating an existing theme is to place\nall the old SASS variables in the theme's <code>\"sass/etc/all.scss\"</code> file.  Any SASS rules that\nthe legacy theme had should be placed in <code>\"sass/src/Component.scss\"</code>.  Then try to build\nthe theme or an app that uses the theme as described above. Eventually you may want to\nmove the variables and rules into the files that correspond to the Components being styled.</p>\n\n<h2 id='theming-section-3'>Styling Your Application</h2>\n\n<p>Styling that is not shared between applications belongs in the application itself, not\nin the theme.  Sencha Cmd provides an easy way to add application-level styling by following\nthe same pattern as theme styling.  The application acts as the final level in the theme\nhierarchy.  Applications can change theme variables, and they can add their own custom\nvariables and rules for styling the application's views.</p>\n\n<h3>Changing Theme Variables in Your Application</h3>\n\n<p>Let's continue using the <code>\"theme-demo-app\"</code> application created above,\nand override the theme's <code>$base-color</code> in the application.\nCreate a file named <code>\"theme-demo-app/sass/var/view/Viewport.scss\"</code>\nand add the following code:</p>\n\n<pre><code>$base-color: #333;\n</code></pre>\n\n<p>Then build the app by running the following command from the <code>\"theme-demo-app\"</code> directory:</p>\n\n<pre><code>sencha app build\n</code></pre>\n\n<p>Open the application's <code>\"index.html\"</code> page in a browser and you will see that the color has\nchanged to gray.</p>\n\n<p>Notice how we did not use <code>!default</code> when setting the $base-color variable.  <code>!default</code> is\nused for setting variables in themes, because those theme variables might need to be\noverridden in a derived theme, or in an application.  <code>!default</code> is not needed here because\nthe application is the end of the line in the theme inheritance tree.</p>\n\n<p>You may also be wondering why we set <code>$base-color</code> in <code>\"Viewport.scss\"</code>\ninstead of <code>\"Component.scss\"</code> like we did when changing the <code>$base-color</code> for a theme.\nThe reason for this is because the namespace that Sencha Cmd uses\nfor resolving scss file names is the namespace of the application.\nFor each class in your application, Sencha Cmd checks for a corresponding scss\nfile in <code>\"sass/var/\"</code> for variables, and <code>\"sass/src/\"</code> for rules.\nSince the application has a class named ThemeDemoApp.view.Viewport,\nthe <code>\"sass/var/view/Viewport.scss\"</code> file gets included in the build.\n<code>\"sass/var/Componenent.scss\"</code> is not included unless the application\nhad a class named \"ThemeDemoApp.Component\".</p>\n\n<h3>Styling Your Application's Views</h3>\n\n<p>CSS style rules for your application's views should go in the app's <code>\"sass/src/\"</code> directory\nin a scss file that has the same path and name as the view it is styling.  Let's style\nthe center panel in the ThemeDemoApp application. Since that panel is defined in\nThemeDemoApp.view.Viewport, the CSS rule that styles it goes in\n<code>\"sass/src/view/Viewport.scss\"</code>:</p>\n\n<pre><code>.content-panel-body {\n    background-color: #ccc;\n}\n</code></pre>\n\n<p>Add the \"content-panel-body\" CSS class to the body of the center panel in your application's\nviewport:</p>\n\n<pre><code>...\nxtype: 'panel',\nui: 'highlight',\nbodyCls: 'content-panel-body',\nframe: true,\n...\n</code></pre>\n\n<p>Now build and run the app.  You should see a gray background-color on the body of the center\npanel.</p>\n\n<h3>The SASS Namespace</h3>\n\n<p>Similar to themes, applications also have <code>\"sass/var\"</code> and <code>\"sass/src\"</code> folders and these\nalso correspond to the JavaScript class hierarchy. For an application, the top-level\nnamespace is specified by <code>app.sass.namespace</code> in <code>\".sencha/app/sencha.cfg\"</code>. By default\nthis value is the application's namespace.</p>\n\n<p>This default is most convenient for styling just your application's views since these are\nmost likely in your application's namespace. To style components outside your application\nnamespace, you can change <code>app.sass.namespace</code> but it may be a better idea to create a\ntheme instead.</p>\n\n<h3>Organization of Generated SASS</h3>\n\n<p>When using themes as described above, the SASS from your theme and from your application\nas well as from required packages (see <a href=\"#/guide/command_packages\">Sencha Cmd Packages</a>)\nis combined in an <code>\"app-all.scss\"</code> file that is then compiled by Compass. It is important\nto understand the structure of this file so that you know what you can use from your\ntheme or required packages and when.</p>\n\n<p>The structure of the <code>\"all.scss\"</code> file generated for your application is this:</p>\n\n<pre><code>+---------------------------------------+\n| inclusion flags                       |\n+-----------+-----------+---------------+\n|           |           | base          |\n|           | theme     +---------------+\n|           |           | derived       |\n|           +-----------+---------------+\n|           |                           |\n|    etc    | packages (dep order)      |\n|           |                           |\n|           +---------------------------+\n|           |                           |\n|           | application               |\n|           |                           |\n+-----------+---------------------------+\n|           |                           |\n|           | application               |\n|           |                           |\n|           +-----------+---------------+\n|           |           | derived       |\n|    var    | theme     +---------------+\n|           |           | base          |\n|           +-----------+---------------+\n|           |                           |\n|           | packages (dep order)      |\n|           |                           |\n+-----------+-----------+---------------+\n|           |           | base          |\n|           | theme     +---------------+\n|           |           | derived       |\n|           +-----------+---------------+\n|           |                           |\n|    src    | packages (dep order)      |\n|           |                           |\n|           +---------------------------+\n|           |                           |\n|           | application               |\n|           |                           |\n+-----------+---------------------------+\n</code></pre>\n\n<p>Inside the \"bands\" for <code>\"sass/var\"</code> and <code>\"sass/src\"</code>, the individual <code>\".scss\"</code> files for a\ngiven theme, package and the application are always ordered to match the JavaScript class\nhierarchy. For example, if the \"base\" theme had <code>\".scss\"</code> files for <code><a href=\"#!/api/Ext.window.Window\" rel=\"Ext.window.Window\" class=\"docClass\">Ext.window.Window</a></code>\nand <code><a href=\"#!/api/Ext.panel.Panel\" rel=\"Ext.panel.Panel\" class=\"docClass\">Ext.panel.Panel</a></code> in its <code>\"sass/var\"</code> folder, the file for <code><a href=\"#!/api/Ext.panel.Panel\" rel=\"Ext.panel.Panel\" class=\"docClass\">Ext.panel.Panel</a></code> would be\nincluded before the file for <code><a href=\"#!/api/Ext.window.Window\" rel=\"Ext.window.Window\" class=\"docClass\">Ext.window.Window</a></code> since <code><a href=\"#!/api/Ext.window.Window\" rel=\"Ext.window.Window\" class=\"docClass\">Ext.window.Window</a></code> extends\n<code><a href=\"#!/api/Ext.panel.Panel\" rel=\"Ext.panel.Panel\" class=\"docClass\">Ext.panel.Panel</a></code>.</p>\n\n<p>The goals and rationale for this particular structure are as follows:</p>\n\n<ul>\n<li>In the <code>\"sass/etc\"</code> space, utilities and the like from base themes should be available\nto derived themes.</li>\n<li>Packages should be able to use facilities provided by the current theme.</li>\n<li>Applications should be able to use their theme and any required packaged.</li>\n<li>In the <code>\"sass/var\"</code> space, the concerns are variable control and derived calculation.</li>\n<li>Applications must be able to control all variables so their <code>vars</code> come first.</li>\n<li>Themes come next so that they pick up application variable values, but they come in\n\"reverse\" order from most derived theme to base. This allows the derived theme to set\nany variables it wants that have not already been set by the application or a more\nderived theme.</li>\n<li>Package variables are introduced in their package dependency order. This allows\npackage variables to derive the values from the current theme (most importantly, from the\n<code>base-color</code>).</li>\n<li>In the <code>\"sass/src\"</code> section, the order is the same as for <code>\"sass/etc\"</code>.\nThis provides the proper cascade of rules so that derived\ntheme rules can easily \"win\" over rules from their base theme(s).</li>\n<li>The application cascades in last so that its rules always have the final authority.</li>\n</ul>\n\n\n<h4>Inclusion Flags</h4>\n\n<p>The \"inclusion flags\" section is a set of variables defined to be <code>true</code> or <code>false</code> for\neach JavaScript class that <em>could</em> be included. The value of this variable is <code>true</code> if\nthat class is being included. For example, if the build uses <code><a href=\"#!/api/Ext.grid.Panel\" rel=\"Ext.grid.Panel\" class=\"docClass\">Ext.grid.Panel</a></code>, this line\nis present in this section:</p>\n\n<pre><code>$include-ext-grid-panel: true;\n</code></pre>\n\n<p>If this build does not include <code><a href=\"#!/api/Ext.menu.ColorPicker\" rel=\"Ext.menu.ColorPicker\" class=\"docClass\">Ext.menu.ColorPicker</a></code> then this line is present:</p>\n\n<pre><code>$include-ext-menu-colorpicker: false;\n</code></pre>\n\n<h2 id='theming-section-4'>Sharing a Theme Between Applications</h2>\n\n<p>It's easy to share the theme you've just built with a second application.  Simply navigate\nto the \"my-workspace\" directory and run the following command:</p>\n\n<pre><code>sencha -sdk ext generate app AnotherApp another-app\n</code></pre>\n\n<p>This tells Sencha Cmd to generate an app in the \"another-app\" directory named \"AnotherApp\"\nand to use the same Ext JS SDK as the first app you created.</p>\n\n<p>The next step is to tell the app to use the custom theme:  Edit\n\"another-app/.sencha/app/sencha.cfg\" and replace the following line:</p>\n\n<pre><code>app.theme=ext-theme-classic\n</code></pre>\n\n<p>with:</p>\n\n<pre><code>app.theme=my-custom-theme\n</code></pre>\n\n<p>Now build the app. From the \"another-app\" directory run:</p>\n\n<pre><code>sencha app build\n</code></pre>\n\n<p>Then open \"another-app/index.html\" page in your browser.  You should see a starter app\nthat uses the same custom theme as ThemeDemoApp.</p>\n"});