Title: Language details - Contributing to Juju docs  


# Using en-GB for en-US writers

The official language of Canonical documentation is English, or en-GB to be
more precise. There are all sorts of minor differences between English and 
American English, including spelling, verb morphology, transitives, etc.

Many of these differences will thankfully have no impact on writing the 
documentation for Juju though - it is unlikely you will be talking about 
"pants" or "hockey" or "tabling motions" for example. The main and most
notable difference is in spelling.

Popular belief is that you will merely need to add a few 'u's to words and 
change -ize to -ise everywhere. It is a bit more complicated than that though.
In fact, many -ize endings *are* acceptable in en-GB, though the -ise endings
are generally preferred. The Oxford English Dictionary Style Guide (1998) has
this to say:

"The verbal ending -ize has been in general use since the 16th century; it is
favoured in American English and in much British writing, and remains the
current preferred style of Oxford University Press in academic and general books
published in Britain. However, the alternative spelling -ise is now widespread
(partly under the influence of French), especially in Britain, and may be
adopted provided that its use is consistent.
...
A number of verbs always end in -ise in British use, notably advertise,
chastise, despise, disguise, franchise, merchandise, surmise, and all verbs
ending in -cise, -prise, -vise (including comprise, excise, prise (open),
supervise, surprise, televise, etc.), but -ize is always used for prize
(=value), capsize, size.
...
Spellings with -yze (paralyze, analyze) are only acceptable in American use."

As you can see, it can be rather tricky. And that is only the ize/ize issue.
There are many other endings which differ (e.g. -eled/-elled as in "travelled" 
and "labelled". The best way to ensure that you are using consistent en-GB 
spelling is to simply enable the en-GB dictionary on whatever software you 
generally use for writing. For example, in `vim` you could execute the command:

```
:setlocal spell spelllang=en_gb 
```

This will change the spelling highlight options for the local buffer only, so
you won't have to worry about whatever language you normally use. Do not worry
about your atrocious grammar (in either variant of the language) as the docs 
monkeys are used to tidying that up!
