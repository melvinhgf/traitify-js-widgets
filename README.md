
Traitify.j
===============

This package does not require jQuery, as it is a standalone encapsulated library. It does however require a browser with the ability to make cors requests (currently only supports ie10 and up, chrome, safari, and firefox).

###
```Shell
cake watch
cake build
cake bundle
cake test
```
### Using Traitify JS:
The CDN can be found at:

```HTML
<script src="https://cdn.traitify.com/js/api/1.0.0.js"></script>
<script src="https://cdn.traitify.com/js/widgets/slide_deck/2.0.0.js"></script>
```

How to initialize:
```HTML
<div>
    <div class="traitify-widget">
    </div>
</div>

<script>
    Traitify.setPublicKey("Your public key");
    Traitify.setHost("The Host For Your Url");
    Traitify.setVersion("Version of API (v1)");
    var assessmentId = "Your assessment Id";

    traitify = Traitify.ui.slideDeck(assessmentId, ".traitify-widget")
</script>
```

When you initialize the widget we return our widget builder to you (This is the same builder we use to construct the widget).
```HTML
<script>
    Traitify.setPublicKey("Your public key");
    Traitify.setHost("The Host For Your Url");
    Traitify.setVersion("Version of API (v1)");
    var assessmentId = "Your assessment Id";

    traitify = Traitify.ui.slideDeck(assessmentId, ".traitify-widget")
        
    traitify.onInitialize(function(){
        console.log(traitify.data);
        console.log("INITIALIZED");
    })
</script>
```
