Ext.data.JsonP.command_app_single({"title": "Single-Page Ext JS Apps", "guide": "<h1>Single-Page Ext JS Apps</h1>\n<div class='toc'>\n<p><strong>Contents</strong></p>\n<ol>\n<li><a href='#!/guide/command_app_single-section-1'>Important Considerations</a></li>\n<li><a href='#!/guide/command_app_single-section-2'>The Application</a></li>\n<li><a href='#!/guide/command_app_single-section-3'>Compiling Your Page</a></li>\n<li><a href='#!/guide/command_app_single-section-4'>Fine Tuning</a></li>\n<li><a href='#!/guide/command_app_single-section-5'>Generating A Custom Bootstrap</a></li>\n</ol>\n</div>\n\n<p><p><img src=\"guides/command_app_single/../command/sencha-command-128.png\" alt=\"\"></p></p>\n\n<p>This guide covers single-page Ext JS applications that <em>do not</em> use the generated scaffold\ndescribed in <a href=\"#/guide/command_app\">Using Sencha Cmd with Ext JS</a>. While the convenient\ncommands like <code>sencha app build</code> won't understand these applications and so cannot be\nused, you can use the lower-level commands provided by Sencha Cmd to produce builds and\nperform all of the same tasks.</p>\n\n<p>The majority of the build process is handled by the Sencha Cmd compiler and the\npackage manager. These building blocks are connected and streamlined in a generated app,\nso that is typically the much simpler and recommended approach. If you need more control\nover the process, however, you can use these pieces directly in your own build process.</p>\n\n<h2 id='command_app_single-section-1'>Important Considerations</h2>\n\n<p>Even though this guide shows how to use Sencha Cmd at a lower level to support different\norganizational preferences, certain guidelines are still important. Please see:</p>\n\n<p><a href=\"#/guide/command_code\">Compiler-Friendly Code Guidelines</a></p>\n\n<h2 id='command_app_single-section-2'>The Application</h2>\n\n<p>We will consider a PHP application with the following folder structure.</p>\n\n<pre><code>index.php           # The application's markup file.\nbuild/              # The folder where build output is placed.\next/                # The framework distribution.\n    src/            # The framework source tree.\njs/                 # Folder containing the application's JavaScript code.\n    app.js          # Contains the Ext Application\n</code></pre>\n\n<p>The <code>\"index.php\"</code> file would look similar to this:</p>\n\n<pre><code>&lt;html&gt;\n    &lt;head&gt;\n        &lt;script src=\"ext/ext-dev.js\" type=\"text/javascript\"&gt;&lt;/script&gt;\n\n        &lt;script src=\"js/app.js\" type=\"text/javascript\"&gt;&lt;/script&gt;\n    &lt;/head&gt;\n    &lt;body&gt;\n        &lt;?php ... ?&gt;\n    &lt;/body&gt;\n&lt;/html&gt;\n</code></pre>\n\n<p>This structure is similar to but not the same as the structure generated by Sencha Cmd.</p>\n\n<h3>Preparing To Compile</h3>\n\n<p>In order for Sencha Cmd to support as many server-side technologies as possible, the\ncompiler has to be guided to the parts of the markup file that are intended for its\nconsumption. Outside of the generated build process, the simplest way to do this is by\nadding special directives inside comments to your page. For example:</p>\n\n<pre><code>&lt;html&gt;\n    &lt;head&gt;\n        &lt;!-- &lt;x-compile&gt; --&gt;\n            &lt;!-- &lt;x-bootstrap&gt; --&gt;\n                &lt;script src=\"ext/ext-dev.js\" type=\"text/javascript\"&gt;&lt;/script&gt;\n            &lt;!-- &lt;/x-bootstrap&gt; --&gt;\n\n            &lt;script src=\"js/app.js\" type=\"text/javascript\"&gt;&lt;/script&gt;\n        &lt;!-- &lt;/x-compile&gt; --&gt;\n    &lt;/head&gt;\n    &lt;body&gt;\n        &lt;?php ... ?&gt;\n    &lt;/body&gt;\n&lt;/html&gt;\n</code></pre>\n\n<p>The open and close tags of the <code>x-compile</code> directive enclose the part of the markup file\nwhere the compiler will operate. The only thing that should be contained in this block\nare <code>script</code> tags. The compiler will process all of these scripts for dependencies.</p>\n\n<p>The exception to this is the <code>\"ext-dev.js\"</code> file. This file is considered to be a\n\"bootstrap\" file for the framework and should not be processed in the same way. The\ncompiler ignores the files in the <code>x-bootstrap</code> block, and they are removed from the\nfinal page, as we will see later.</p>\n\n<h2 id='command_app_single-section-3'>Compiling Your Page</h2>\n\n<p>The first job of the compiler is to examine and parse the JavaScript source code and\nanalyze its dependencies. These dependencies are expressed in code using <code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a></code> and\nthe <code>requires</code> (or <code>uses</code>) directives. Also, base classes and mixins are considered to be\ndependencies in the same way as <code>requires</code>.</p>\n\n<p>The application requires its own code (in the <code>\"js\"</code> folder) as well as some of the\nframework (in the <code>\"ext\"</code> folder). The goal is to create a single JavaScript file that\ncontains all of the code needed from both folders and exclude any code that is not used.</p>\n\n<p>Since most build processes create the production build in a separate folder, let's use the\n\"build\" folder to hold the outputs and thereby avoid overwriting any source code.</p>\n\n<p>Lets start with this command:</p>\n\n<pre><code>sencha compile -classpath=ext/src,js page -yui -in index.php -out build/index.php\n</code></pre>\n\n<p>This command performs the following steps:</p>\n\n<ul>\n<li>The <code>-classpath</code> switch provides the compiler with all of the folders containing source\ncode to be considered, in this case, the <code>\"ext/src\"</code> and <code>\"js\"</code> folders.</li>\n<li>The compiler's <code>page</code> command then includes all of the <code>script</code> tags in <code>\"index.php\"</code>\nthat are contained in the <code>x-compile</code> block.</li>\n<li>Given all of the contents of <code>\"ext/src\"</code>, <code>\"js\"</code>, and <code>\"index.php\"</code>, the compiler analyzes\nthe JavaScript code and determines what is ultimately needed by <code>\"index.php\"</code>.</li>\n<li>A modified version of <code>\"index.php\"</code> file is written to <code>\"build/index.php\"</code>.</li>\n<li>All of the JavaScript files needed by <code>\"index.php\"</code> are concatenated, compressed using\nthe <a href=\"http://developer.yahoo.com/yui/compressor/\">YUI Compressor</a>, and written to the\nsingle file <code>\"build/all-classes.js\"</code>.</li>\n</ul>\n\n\n<p>The compiled version of <code>\"index.php\"</code> should look approximately like this:</p>\n\n<pre><code>&lt;html&gt;\n    &lt;head&gt;\n        &lt;script src=\"all-classes.js\" type=\"text/javascript\"&gt;&lt;/script&gt;\n    &lt;/head&gt;\n    &lt;body&gt;\n        &lt;?php ... ?&gt;\n    &lt;/body&gt;\n&lt;/html&gt;\n</code></pre>\n\n<p>The entire <code>x-compile</code> section is replaced by the single <code>script</code> tag that includes the\n<code>\"all-classes.js\"</code> file. The rest of the page remains unchanged.</p>\n\n<p>This is just one step of a complete build process. The others are typically simpler\n(for example, copying files) and are not considered here.</p>\n\n<h2 id='command_app_single-section-4'>Fine Tuning</h2>\n\n<p>Due to the nature of dependency analysis, your application may contain code you know will\nnever be used. By understanding the compiler below the level of the <code>sencha compile page</code>\ncommand, you can see how to go about further tuning this process. Beyond these techniques\nyou can also use the compiler without the <code>page</code> command and operate purely on JavaScript\nsource files. For more information on this lowest-level of the compiler, see the\n<a href=\"#/guide/command_compiler\">Sencha Compiler Reference</a></p>\n\n<p>If you were to remove the <code>-yui</code> switch from the compile command show above, you can\nexamine <code>\"all-classes.js\"</code> and inspect the code that was identified as being needed by your\napplication. If you see classes that you would like to remove, you can do that with\nadvanced features of the compiler.</p>\n\n<p>At its core, the compiler uses the concept of \"sets\" and set operations to manage what is\nincluded in the concatenated output file. It first builds the set of all files as it reads\nthe code from the <code>-classpath</code>. The <code>page</code> command then determines the subset of files used\nby <code>\"index.php\"</code>.</p>\n\n<p>To illustrate, let's assume that somehow the Tree package (<code>Ext.tree</code>) is being pulled in\nto <code>\"all-classes.js\"</code> and we are certain that that's incorrect. The following command\nremoves this namespace:</p>\n\n<pre><code>sencha compile -classpath=ext/src,js \\\n    page -name=page -in index.php -out build/index.php and \\\n    restore page and \\\n    exclude -namespace Ext.tree and \\\n    concat -yui build/all-classes.js\n</code></pre>\n\n<p>The first change is to provide a name for the set of files produced by the <code>page</code> command.\nBy naming the set we disable the automatic generation of <code>\"all-classes.js\"</code> so we can adjust\nits contents before generating it explicitly.</p>\n\n<p>This also illustrates the use of command chaining and category state discussed in more\ndetail in <a href=\"#/guide/command_advanced\">Advanced Sencha Cmd</a>. To summarize these two concepts:</p>\n\n<ol>\n<li>Each use of <code>and</code> separates commands in the same category (<code>compile</code> in this case).</li>\n<li>The state of the <code>compile</code> is preserved across these commands.</li>\n</ol>\n\n\n<p>Lets break down the individual steps in the above command as it deviates from the original.</p>\n\n<p>The <code>compile</code> command does the same as before and reads the code in the <code>-classpath</code>.</p>\n\n<pre><code>sencha compile -classpath=ext/src,js \\\n</code></pre>\n\n<p>The <code>page</code> command determines what is needed by <code>\"index.php\"</code> and generates the modified\nversion in \"build/index.php\". The <code>page</code> command also saves the set of files in a set\nnamed <code>page</code> (and does not generate <code>\"all-classes.js\"</code>).</p>\n\n<pre><code>    page -name=page -in index.php -out build/index.php and \\\n</code></pre>\n\n<p>The <code>restore</code> command restores the named set (<code>page</code>) as the <code>current set</code>. Most of the\nsubcommands of the compiler operate on the current set. Without this command, the\ncurrent set would be <code>all files</code>.</p>\n\n<pre><code>    restore page and \\\n</code></pre>\n\n<p>The <code>exclude</code> command removes all files in the <code>Ext.tree</code> namespace from the current set.</p>\n\n<pre><code>    exclude -namespace Ext.tree and \\\n</code></pre>\n\n<p>The <code>concat</code> command concatenates and compresses all files in the current set and writes\nthe result to <code>\"build/all-classes.js\"</code>.</p>\n\n<pre><code>    concat -yui build/all-classes.js\n</code></pre>\n\n<p>There are many more commands and options provided to manipulate the current set. Basically,\nif you can imagine a way to arrive at the desired set of files using a sequence of set\noperations, the compiler can combine just those files for you. For more on this topic,\nsee the <a href=\"#/guide/command_compiler\">Sencha Compiler Reference</a>.</p>\n\n<h2 id='command_app_single-section-5'>Generating A Custom Bootstrap</h2>\n\n<p>The \"bootstrap\" file included in the example application (<code>\"ext-dev.js\"</code>) contains two very\nimportant things:</p>\n\n<ul>\n<li>The minimal amount of the framework required to perform dynamic loading.</li>\n<li>All of the metadata describing the classes and aliases in the framework.</li>\n</ul>\n\n\n<p>This second part is what allows <code>requires</code> statements to use wildcards as in:</p>\n\n<pre><code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>(..., {\n    requires: [\n        'Ext.grid.*'\n    ]\n});\n</code></pre>\n\n<p>To use similar syntax in your application, you need to provide the required metadata for\nthe dynamic loader. The following command generates such a file:</p>\n\n<pre><code>sencha compile -classpath=js \\\n    meta -alias -out build/bootstrap.js and \\\n    meta -alt -append -out build/bootstrap.js\n</code></pre>\n\n<p>This file should be added to the <code>x-bootstrap</code> section, like so:</p>\n\n<pre><code>&lt;html&gt;\n    &lt;head&gt;\n        &lt;!-- &lt;x-compile&gt; --&gt;\n            &lt;!-- &lt;x-bootstrap&gt; --&gt;\n                &lt;script src=\"ext/ext-dev.js\" type=\"text/javascript\"&gt;&lt;/script&gt;\n                &lt;script src=\"build/bootstrap.js\" type=\"text/javascript\"&gt;&lt;/script&gt;\n            &lt;!-- &lt;/x-bootstrap&gt; --&gt;\n\n            &lt;script src=\"js/app.js\" type=\"text/javascript\"&gt;&lt;/script&gt;\n        &lt;!-- &lt;/x-compile&gt; --&gt;\n    &lt;/head&gt;\n    &lt;body&gt;\n        &lt;?php ... ?&gt;\n    &lt;/body&gt;\n&lt;/html&gt;\n</code></pre>\n\n<p>There are other uses for code metadata. For details on generating metadata and what kinds\nof metadata are provided, see <a href=\"#/guide/command_compiler_meta\">Generating Metadata</a>.</p>\n\n<p><strong>Note.</strong> This is handled automatically for generated applications.</p>\n"});