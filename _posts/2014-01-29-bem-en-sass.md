---
layout: post
title: BEM in SASS 3.3 (update)
style: post-3
---

<div class="update">
<h2>UPDATE</h2>
<p>Er is een update van Sass (3.3.orc3) waarbij het mogelijk is om BEM op de volgende manier te gebruiken:</p>

{% highlight scss %}
.block {
    &__element {
    }
    &--modifier {
    }
}
{% endhighlight %}

<p>Kijk voor meer info op: <a href="http://alwaystwisted.com/post.php?s=2014-02-27-even-easier-bem-ing-with-sass-33">http://alwaystwisted.com/post.php?s=2014-02-27-even-easier-bem-ing-with-sass-33</a></p>
</div>

Iedere front-end developer gebruikt tegenwoordig wel Sass (of Less) voor het schrijven van zijn CSS. Ik kan niet meer zonder. De methode BEM voor het benoemen van CSS classes is voor velen -denk ik- minder bekend. Ik gebruik het veel tegenwoordig. De combinatie van BEM en Sass is vooral ideaal wanneer je met meerdere developers aan grote complexe websites werkt.

## Wat is Sass?
Sass *(Syntactically Awesome Stylesheets)* is een precompressor waarmee je css bestanden kunt compilen. In Sass-bestanden (.scss) kun je gebruik maken van allerlei technieken die het gemakkelijk maken om css te schrijven. Ik ga er eigenlijk van uit dat Sass bekend bij je is. Zo niet, stop hier en ga eerst aan de slag met [Sass](http://sass-lang.com/).

## Wat is BEM?
[Bem](http://bem.info) *(Block, Element, Modifier)* is een systematische manier voor het benoemen van je CSS classes. Het is eerst even wennen en ziet er misschien gek uit, maar went snel. Met onderstaand voorbeeld van een simpele `ul` wordt het basis-principe goed duidelijk:

{% highlight scss %}
.list{}
.list__item{} // __ voor child-elementen
.list__item--active{} // -- voor variaties 
{% endhighlight %}

{% highlight html %}
<ul class="list">
    <li class="list__item"></li>
    <li class="list__item"></li>
    <li class="list__item list__item--active"></li>
</form>
{% endhighlight %}

Met BEM gebruik je alleen classes en kun je ze zo definiëren dat ze altijd direct aan te roepen zijn in je css. Voor uitgebreide uitleg is het artikel [MindBEMding](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/) van [@CSSWizardy](http://twitter.com/csswizardy) een must-read.

**Wat is nu eigenlijk het probleem?**<br>
Bovenstaand voorbeeld van de `ul` zou je in je .scss-bestand op de volgende manier schrijven:

{% highlight scss %}
.list{
    .list__item{
        &.list__item--active{} 
    }
}
{% endhighlight %}

Dit is niet optimaal en ook de output van de css laat veel te wensen over. Je wilt namelijk geen *'nested'* classes zoals:

{% highlight css %}
.list{}
.list .list__item{}
.list .list__item.list__item--active{} 
{% endhighlight %}

## Sass 3.3
In Sass 3.3 is dit probleem opgelost. Door het toevoegen van `@at-root` kun je de schrijfwijze gebruiken die je gewend bent in je .scss-bestanden. Upgraden van Sass doe je in de terminal:

    gem install sass --pre 

## @at-root
Het eerder gebruikte voorbeeld zou je nu op de volgende manier kunnen schrijven:
{% highlight scss %}
.list{
    @at-root{
        .list__item{}
        .list__item--active{} 
    }
}
{% endhighlight %}

Mooi, maar nog niet ideaal. Je wilt eigenlijk geen extra regels typen, dus ben ik hier een simpele mixin voor gaan maken. 

{% highlight scss %}
@mixin root($name){
  @at-root .#{$name}{
    @content;
  }
}

.list{
    @include root(list__item){
        @include root(list__item--active){
        }
    }
}

{% endhighlight %}

Dit werkte op zich prima, maar je moest nog te veel code typen. Na enig nadenken en prutsen kwam ik uiteindelijk tot een oplossing die heel veel lijkt op die van [Una Kravets](http://blog.unakravets.com/post/64113156740/sass-3-3-at-root-bem). Deze is echter nog beknopter (en dus beter) en gebruik ik tegenwoordig veelvuldig:

{% highlight scss %}
// __elements
@mixin e($name){
  @at-root #{&}__#{$name}{
    @content;
  }
}

// --modifiers
@mixin m($name){
  @at-root #{&}--#{$name}{
    @content;
  }
}

.list{
    @include e(item){
        @include m(active){
        }
    }
}
{% endhighlight %}

Hiermee is de css precies zoals gewenst en hoef je niet de hele class-naam over te typen. Een perfecte manier?! 

Gebruik je ook BEM in combinatie met Sass, dan ben ik erg benieuwd naar jouw bevindingen.