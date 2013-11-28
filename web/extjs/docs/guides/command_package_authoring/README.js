Ext.data.JsonP.command_package_authoring({"title": "Creating Sencha Cmd Packages", "guide": "<h1>Creating Sencha Cmd Packages</h1>\n<div class='toc'>\n<p><strong>Contents</strong></p>\n<ol>\n<li><a href='#!/guide/command_package_authoring-section-1'>Generating Packages</a></li>\n<li><a href='#!/guide/command_package_authoring-section-2'>Anatomy of a Package</a></li>\n<li><a href='#!/guide/command_package_authoring-section-3'>Integrating Packages in Application Builds</a></li>\n<li><a href='#!/guide/command_package_authoring-section-4'>Building The Package</a></li>\n<li><a href='#!/guide/command_package_authoring-section-5'>Local Repository</a></li>\n<li><a href='#!/guide/command_package_authoring-section-6'>Adding Packages</a></li>\n<li><a href='#!/guide/command_package_authoring-section-7'>Hosting A Package Repository</a></li>\n</ol>\n</div>\n\n<p>Sencha Cmd v3.1 includes the Sencha Package Manager. Packages have many uses even if you\ndo not intend to distribute the packages you create. This guide covers to process of\ncreating your own packages as well as distributing them. For information on using packages\nplease refer to <a href=\"#/guide/command_packages\">Sencha Cmd Packages</a>.</p>\n\n<p><p><img src=\"guides/command_package_authoring/../command/sencha-command-128.png\" alt=\"\"></p></p>\n\n<h2 id='command_package_authoring-section-1'>Generating Packages</h2>\n\n<p>Before we can generate a new package, we must first create a home for it: a\n<a href=\"#/guide/command_workspace\">Workspace</a>. For this example we will use Ext JS 4.2 for this\npackage, so we start with this command:</p>\n\n<pre><code>sencha -sdk /path/to/ext-4.2.0 generate workspace /path/to/workspace\n</code></pre>\n\n<p>Now we navigate to the new workspace and generate the package:</p>\n\n<pre><code>cd /path/to/workspace\nsencha -sdk ext generate package -type code foo\n</code></pre>\n\n<h2 id='command_package_authoring-section-2'>Anatomy of a Package</h2>\n\n<p>The above steps will produce a starter package that contains many commonly used pieces.\nYou can delete many of these but it is important to keep the <code>\".sencha\"</code> folder intact.</p>\n\n<p>The structure of a package generated by <code>sencha generate package</code> is as follows:</p>\n\n<pre><code>packages/\n    foo/                        # Top-level folder for the package\n        .sencha/\n            package/\n                sencha.cfg      # Sencha Cmd configuration for this package\n                build-impl.xml  # Generated build script for package\n                plugin.xml      # Sencha Cmd plugin for this package\n                codegen.json    # Data to support 3-way merge in code generator\n        docs/                   # Documentation for the package\n            screenshots/        # Screen shots for Sencha Market\n        licenses/               # License agreement\n        overrides/              # Folder for automatically activated overrides\n        resources/              # Static resources (typically has images folder)\n        sass/                   # Container for Sass code\n            etc/                # General, non-component oriented Sass\n            src/                # Sass rules and mixins named by component\n            var/                # Sass variables named by component\n        src/                    # Folder for normal JavaScript code\n        build.xml               # Build script (called by `sencha package build`)\n        package.json            # Package descriptor\n        Readme.md               # High-level information about this package\n</code></pre>\n\n<p>While the above is quite extensive, the only parts that are required to be a package are\nthese: <code>\"package.json\"</code> and <code>\".sencha/package/sencha.cfg\"</code>.</p>\n\n<p>The <code>\"package.json\"</code> file contains a description of the package. An example of this from\nthe <code>\"ext-theme-neptune\"</code> package:</p>\n\n<pre><code>{\n    \"name\": \"ext-theme-neptune\",\n    \"type\": \"theme\",\n    \"creator\": \"Sencha\",\n    \"summary\": \"Ext JS Neptune Theme\",\n    \"detailedDescription\": \"The Neptune Theme provides a clean, modern style for Ext JS\",\n    \"version\": \"4.2.1\",\n    \"compatVersion\": \"4.2.0\",\n    \"format\": \"1\",\n    \"extend\": \"ext-theme-neutral\"\n}\n</code></pre>\n\n<p>The <code>creator</code> property is something you will need to set as a package author. There is no\nverification of this text, but it must match the name you assign to your local package\nrepository discussed later.</p>\n\n<p>The <code>\".sencha/package/sencha.cfg\"</code> file is primarily important to the developer of the\npackage as it is used by Sencha Cmd during <code>sencha package build</code>. It is also used by\nby user applications during their <code>sencha app build</code> process.</p>\n\n<h2 id='command_package_authoring-section-3'>Integrating Packages in Application Builds</h2>\n\n<p>The purpose of most packages is to (eventually) become integrated in an application. To\naccomplish this, Sencha Cmd incorporates the various pieces of each required package in\nto an application during the <code>sencha app build</code> process.</p>\n\n<p>Precisely how this takes place depends on the <code>type</code> of the package.</p>\n\n<h3>Package Type</h3>\n\n<p>Different types of packages play different roles. Sencha Cmd understands the following\ntypes of packages:</p>\n\n<ul>\n<li><strong><code>code</code></strong> - An arbitrary package of code for use by applications or other packages.\nThese packages are general purpose and are included when there is a <code>require</code> statement\nthat selects them.</li>\n<li><strong><code>theme</code></strong> - A package to be used as an application's theme. Themes are special in that\nonly one package of type <code>theme</code> is allowed to be \"active\" in a build. This theme is\nselected by the <code>app.theme</code> property  and it causes all other theme packages that may\nbe in a <code>require</code> to be filtered out. Themes can also use <code>extend</code> to inherit Sass and\nresources from another theme package.</li>\n<li><strong><code>locale</code></strong> - A package containing localization strings or locale-specific code. These\npackages have a similar selection method to <code>theme</code> packages. Packages of this type add\na property to their <code>\"package.json\"</code> called <code>\"locale\"</code>. This should be set to the name\nof the locale to which this package applies (e.g., <code>\"he\"</code> for Hebrew). The <code>app.locale</code>\nproperty, if set, causes any package of this type with a different value in its <code>locale</code>\nto be filtered out. This means you can have many different locale packages with the\nsame <code>locale</code> value and they will all be included</li>\n</ul>\n\n\n<h3>Source Code</h3>\n\n<p>The <code>\"src\"</code> folder is the place for classes such as custom components or other useful\ncode. This code is automatically included in the <code>classpath</code> for applications or other\npackages to <code>require</code> and use.</p>\n\n<p>This is where you would likely put most of your JavaScript code. Classes placed in this\nfolder should follow the <a href=\"#/guide/command_code\">Compiler-Friendly Code Guidelines</a>.</p>\n\n<h3>Sass</h3>\n\n<p>The <code>\"sass\"</code> folder contains three sub-folders designed to handle different aspects of\nSass compilation.</p>\n\n<ul>\n<li><code>\"sass/etc\"</code> - Code that does not relate directly to JavaScript classes</li>\n<li><code>\"sass/var\"</code> - Variable definitions (mirroring JavaScript class hierarchy)</li>\n<li><code>\"sass/src\"</code> - Mixins and rules (mirroring JavaScript class hierarchy)</li>\n</ul>\n\n\n<p>The folders and files in <code>\"sass/var\"</code> and <code>\"sass/ssrc\"</code> are organized such that they are\nmirror images of the JavaScript classes to which they apply. This correspondence allows\nSencha Cmd to include the files needed by the application. Files in these folders that\ndo not conform to this will never be included since the process proceeds by mapping the\nJavaScript class hierarchy to the file system and not be scanning these folders.</p>\n\n<p>The <code>package.sass.namespace</code> (in <code>\".sencha/package/sencha.cfg\"</code>) determines the top-level\nnamespace to which your styling applies. This defaults to <code>Ext</code> for packages. You will\nmost likely need to change this in order to associate your Sass with your classes inside\nyour package's namespace.</p>\n\n<h3>Resources</h3>\n\n<p>The <code>\"resources\"</code> folder is where you place static resources needed by the package. When\napplications consume the package, they will copy these resources into a sub-folder of their\nown <code>\"resources\"</code> folder named by the package name. In this case, <code>\"resources/foo\"</code>. The\nrelative paths used by Sass will be automatically corrected if you use the provided\n<code>theme-background-image</code> method.</p>\n\n<h3>Overrides</h3>\n\n<p>The <code>\"overrides\"</code> folder is specifically intended for your package to provide mandatory\noverrides, hence its name. This mechanism should be used cautiously because all code you\nplace in this folder will be automatically required in to any application that uses this\npackage.</p>\n\n<p>The Ext JS Neptune Theme uses this mechanism to change certain default config properties\non various components. Locale packages use this to inject their own text on to the\nprototypes of various components or to provide locale-specific logic for things such as\ndate formatting.</p>\n\n<h3>Package Versions</h3>\n\n<p>Packages have a <code>version</code> property that describes its current version number. In\naddition the current version (in the <code>version</code> property), packages can also indicate the\ndegree to which they are backward compatible using the <code>compatVersion</code> property.</p>\n\n<p>These versions are used when resolving package requirements. Each release of a package\nshould have an updated version number. The meaning assigned to version numbers by Sencha\nmay help you:</p>\n\n<pre><code>x.y.z.b\n\nx = Major release number (large, impacting changes and features)\ny = Minor release number (new functionality but few if any breaking changes)\nz = Patch release number (bug fix / maintenance release - goal of 100% compatible)\nb = Build number (assigned by build system)\n</code></pre>\n\n<p>The <code>version</code> property is typically the easiest to maintain. The <code>compatVersion</code>, however,\nis an intentional statement about the degree to which users should be able to transparently\nupgrade and not require code changes.</p>\n\n<h3>Package Requirements</h3>\n\n<p>Packages can require other packages in the same way that applications can require packages.\nTo do this, you add to the <code>requires</code> array:</p>\n\n<pre><code>{\n    \"name\": \"bar\",\n    \"type\": \"code\",\n    \"creator\": \"anonymous\",\n    \"summary\": \"Short summary\",\n    \"detailedDescription\": \"Long description of package\",\n    \"version\": \"1.0.0\",\n    \"compatVersion\": \"1.0.0\",\n    \"format\": \"1\",\n    \"local\": true,\n    \"requires\": [\n        'ext-easy-button'\n    ]\n}\n</code></pre>\n\n<p><strong>NOTE</strong>: When using version restrictions as a package author, it is important to consider\nthat an application and all of the required packages will have to agree on a common version.\nIf you are too restrictive, this process can fail to find a mutually agreeable version for\nall of the required packages.</p>\n\n<h3>Package Inheritance</h3>\n\n<p>The notion of inheritance for packages is intended exclusively for Themes. These are\nmost important ways in which the inherited package contents are rolled into the derived\npackage:</p>\n\n<ul>\n<li>The <code>\"resources\"</code> folders of inherited packages is copied in to the <code>\"resources\"</code>\nfolder in the <code>\"build\"</code> output folder.</li>\n<li>The <code>overrides</code> of base packages are automatically included in the build output of\nthe derived package.</li>\n</ul>\n\n\n<h2 id='command_package_authoring-section-4'>Building The Package</h2>\n\n<p>To publish the package, you will need to build it using:</p>\n\n<pre><code>sencha package build\n</code></pre>\n\n<p>This produces a <code>\"build\"</code> folder inside the package. This is needed by applications when\nthey are running in \"dev mode\" (without being compiled). It also produces <code>\"foo.pkg\"</code> file\nin your workspace's <code>\"build\"</code> folder. This file is not placed in the package's <code>\"build\"</code>\nfolder because:</p>\n\n<ul>\n<li>It is a ZIP file of your package folder.</li>\n<li>It is not needed by users of the package.</li>\n</ul>\n\n\n<p>The <code>\"foo.pkg\"</code> file is used to add the package to your local repository. See below.</p>\n\n<p><strong>NOTE</strong>: In Cmd v3.1.0, <code>sencha package build</code> may fail if you have Sass that depends\non the theme. To workaround this limitation, you can set the <code>skip.sass</code> and <code>skip.slice</code>\nproperties in <code>\".sencha/package/sencha.cfg\"</code>. The package will be usable in an application\nbecause the theme will be included in <code>sencha app build</code>.</p>\n\n<h2 id='command_package_authoring-section-5'>Local Repository</h2>\n\n<p>The local repository was introduced in <a href=\"#/guide/command_packages\">Sencha Cmd Packages</a>,\nbut there is more to know about it when you want distribute the packages you have created.</p>\n\n<h3>Structure</h3>\n\n<p>The local repository generated by Sencha Cmd looks like this:</p>\n\n<pre><code>.sencha/\n    repo/\n        sencha.cfg                  # Sencha Cmd configuration for the repo\n        plugin.xml                  # Plugin for repository hooks\n        private-key.json            # Private key for repo\n\n        remotes/                    # Storage for remote repositories\n            remoteName/             # Name given at `sencha repo add`\n                catalog.json        # Last catalog from this remote\n\n        trust/                      # Unused in this release\n            &lt;somename&gt;.cert.json    # Copy of `cert.json` (a public key)\n\npkgs/\n    catalog.json                    # Catalog of all packages in this repo\n    cert.json                       # Public key for this repo\n\n    Foo/\n        catalog.json                # Catalog for all versions of Foo package\n        cert.json                   # Public key for creator of Foo package\n\n        1.0/                        # Folder containing version 1.0\n            Foo.pkg                 # Zip file of package\n            package.json            # Extracted package descriptor\n        1.1/\n            ...\n\n    Bar/\n        ...\n</code></pre>\n\n<h3>Author Identity</h3>\n\n<p>When Sencha Cmd generates the default local repository, it does not require you to provide\nany kind of identity. This is fine for its role as a cache, but as a package author you\nneed to put your name on the packages you publish. Before you can publish packages you\nneed to initialize your local repository with an identity:</p>\n\n<pre><code>sencha package repo init -name \"My Company\" -email \"support@mycompany.com\"\n</code></pre>\n\n<p>After this step, your name and email address will be recorded in the local repository along\nwith a new <a href=\"http://en.wikipedia.org/wiki/Public-key_cryptography\">public/private key pair</a>.</p>\n\n<p><strong>NOTE</strong>: The <code>name</code> argument must match the value of the <code>creator</code> property you set in\nthe <code>\"package.json\"</code>.</p>\n\n<h3>Public/Private Keys</h3>\n\n<p>Your name, email and public key are stored in the <code>\"pkgs/cert.json\"</code> file. This file will\nbe automatically added to the packages you create to identify you as the package author.</p>\n\n<p>Obviously given its name, your private key is not intended to be shared with others. It\nis stored in your local repository in <code>\".sencha/repo/private-key.json\"</code>.</p>\n\n<p>You might want to back up these two files as they will serve more important roles in\nfuture releases.</p>\n\n<h3>Content</h3>\n\n<p>The <code>\"pkgs\"</code> folder is where all the packages are stored. These may be packages you have\ncreated or packages that you have downloaded.</p>\n\n<p>When you add package <code>\".pkg\"</code> files, these will be copied in to the <code>\"pkgs\"</code> folder tree.</p>\n\n<h3>Repository Hooks</h3>\n\n<p>The <code>\".sencha/repo/plugin.xml\"</code> file is an <a href=\"http://ant.apache.org/\">Ant</a> script that you\ncan use to provide \"hooks\" into repository actions such as <code>sencha package add</code>. For more\ndetails on this, refer to the comments in the generated file.</p>\n\n<p><em>Since</em>: Sencha Cmd v3.1.1</p>\n\n<h2 id='command_package_authoring-section-6'>Adding Packages</h2>\n\n<p>Once you have the <code>\".pkg\"</code> file from the build, and assuming that the <code>name</code> you have set\nas your identity on your local repository matches the <code>creator</code> property defined in your\n<code>\"package.json\"</code>, you can run this command:</p>\n\n<pre><code>sencha package add foo.pkg\n</code></pre>\n\n<p>Sencha Cmd will produce a hash of the <code>\".pkg\"</code> file using your private key and add it to\nthe <code>\".pkg\"</code> file you specify and it will then copy that file to the local repository.</p>\n\n<p>Now that the package reside in the repository, other developers can <code>require</code> it if they\nhave added your repository as a remote.</p>\n\n<p>The process to request that Sencha add your <code>\".pkg\"</code> to the Sencha Package Repository is\nstill being finalized, but you can check <a href=\"https://market.sencha.com/\">Sencha Market</a> for\nupdates on this.</p>\n\n<h2 id='command_package_authoring-section-7'>Hosting A Package Repository</h2>\n\n<p>The structure of the <code>\"pkgs\"</code> folder is the structure expected for a remote repository. All\nthat is required for others to <code>require</code> the packages you create is for them to add a\nremote repository:</p>\n\n<pre><code>sencha package repo add my-company http://my.company.com/packages\n</code></pre>\n\n<p>That is, assuming you have hosted your <code>\"pkgs\"</code> folder content at the above HTTP URL. There\nis nothing required of that hosting beyond HTTP GET access so a static file server or CDN\nwill work.</p>\n"});