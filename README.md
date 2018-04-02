# Motivation

There are a lot of people out there writing high quality trivia these days, from [Learned League](https://learnedleague.com) to [Geeks Who Drink](http://www.geekswhodrink.com) to the hundreds of independent quizmasters around the world. Everybody probably has their format for storing and cataloging their questions. Wouldn't it be nice if their was a standardized format to represent a set of trivia questions to facilitate the exchange of ideas in our industry?

Eh, maybe, maybe not. This may totally be a solution in search of a problem. Still, all things being equal it's probably better to have a (very informal) standard than not to have one, and if nothing else I hope that this little project might serve as a nucleation point from which other tools for the trivia world might grow.

# Method

`trivia-schema.json` is based on [JSON Schema](http://json-schema.org/), a meta-syntax for specifying JSON based data formats. I chose JSON mostly because these days I am primarily a JavaScript programmer but also because it is easy to read and write and is widely supported.

The standard as written is somewhat over-engineered. The multimedia annotations in particular may be total overkill, but I thought there might be some value in allowing the format to represent a modified or redacted version of an original image or sound. In most cases though I would expect that authors will edit their multimedia files directly.

## The Format

If a property is fairly self explanatory only its type will be described in the tables below.

### Top Level Object

The format makes no assumptions that the questions represented by a document form a semantic grouping like a "round" or "game" or whatever, but the fields are there to describe that if you wish.

Property | Description | Required
---------|-------------|---------
`"title"` | (string) | N
`"description"` | (string) | N
`"keywords"` | Short tags for categorizing this set (array of strings) |N
`"references"` | Source materials for this set of questions (array of reference objects - see below) | N
`"authors"` | (array of strings or person objects - see below) | N
`"creationDate"` | (string - YYYY-MM-DD) | N
`"uri"` | Canonical URI (REST style) where this set of questions can be located (string) | N
`"styling"` | Syntax used for multimedia styling, either `"html"` (default) or `"bbcode"` or `"none"` | N
`"items"` | Set of questions (array of item objects - see below) | Y
`"multimedia"` | Array of multimedia objects that can be referenced from items | N

### Item Object

The only time the `"question"` property would not be required is if the "question" is entirely represented by multimedia.

Property | Description | Required
---------|-------------|---------
`"question"` | Text of question, formatted based on top-level `"styling"` property | N
`"answer"` | Answer to question (string or answer object - see below) | Y
`"choices"` | Answer choices for multiple choice style questions (array of strings or choice objects - see below) | N
`"keywords"` | Short tags for categorizing this set (array of strings) |N
`"difficulty"` | Estimate of question difficulty (number between 1 and 5 inclusive)
`"references"` | Source materials for this set of questions (array of reference objects - see below) | N
`"authors"` | (array of strings or person objects - see below) | N
`"creationDate"` | (string - YYYY-MM-DD) | N
`"uri"` | Canonical URI (REST style) where this set of questions can be located (string) | N
`"bonuses"` | Set of bonus items linked to this one. The spec doesn't prohibit arbitrary recursion, but don't do it (array of item objects)| N
`"multimedia"` | Any multimedia (images or audio) linked to this question. Array where the entries are either multimedia objects as described below or simple objects with a single property `"mmref"` which is a (zero-based) index into the top level `"multimedia"` array. (as described) | N

### Answer Object

Answers may be specified as just strings or using one of the more specific object formats described below. Strings, regular expression objects, and choice objects are considered "simple".

#### Regular Expression Answer

Of possible value for automatic grading.

Property | Description 
---------|-------------
`"regex"`| Regular expression using the [ECMA 262](http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf) syntax that matches a correct answer

#### Choice Answer

Only applies to multiple choice questions.

Property | Description 
---------|-------------
`"choice"` | **1-based** index into `"choices"` array for correct answer

#### Disjunction

Correct if answer matches any of the listed answers.

 Property | Description 
---------|-------------
`"or"` | Array of simple answers

#### Conjunction

Correct only if all listed answers are provided

 Property | Description 
---------|-------------
`"and"` | Array of simple answers

#### Subset

Correct if the required number of correct answers are provided from the given set.

 Property | Description 
---------|-------------
`"n"` | Number of answers required
`"of"` | Array of simple answers

### Choice Object

Represents a single answer choice in the multiple choice format. May contain text, multimedia, or both

Property | Description | Required
---------|-------------|---------
`"text"` | (string) | N
`"multimedia"` | Any multimedia (images or audio) linked to this question. Array where the entries are either multimedia objects as described below or simple objects with a single property `"mmref"` which is a (zero-based) index into the top level `"multimedia"` array. (as described) | N

### Person Object

Property | Description | Required
---------|-------------|---------
`"name"` | (string) | N
`"email"` | (string) | N
`"website"` | (string) | N
`"facebook"` | (string) | N
`"twitter"` | (string) | N
`"linkedin` | (string) | N

### Reference Object

Property | Description | Required
---------|-------------|---------
`"type"` | `"webpage"`, `"book"`, `"article"`, more TBA as needed | Y
`"title"` | (string) | N
`"uri"` | (string) | N
`"vol"` | (number or string) | N
`"number"` | (number string) | N
`"page` | (string) | N

### Multimedia Object

Property | Description | Required
---------|-------------|---------
`"type"` | `"image"` or `"audio"` | Y
`"label"` | Application dependent. Can be used as a caption, for example. (string) | N
`"sources"` | If there are multiple sources all should represent the same image or audio. The user agent should pick the best one (array of source objects - see below) | Y
`"annoation"` | (annotation object - see below) | N

### Source Object

Property | Description | Required
---------|-------------|---------
`"mimetype"` | For images: `"image/jpeg"`, `"image/png"`, `"image/gif"` For audio: `"audio/mpeg"` or `"audio/ogg"` | Y
`"uri"` | URI (local or remote) for source (string) | N
`"data"` | Base64 encoded binary data representing the image or audio (string) | N

### Annotation Object

To be documented. Or not. As I say, the necessity of this feature is somewhat questionable, so I'm not going to spend a lot of time explaining it right now. Anybody who wants to use it can probably figure it out from the spec. I am going to specify a couple of things we need a convention on though.

* The coordinate system for images puts (0,0) in the upper left and increases down and to the right.
* In applying the transformations, drawing happens first, then clipping, then scaling.

# Tools

There are a couple of quick and dirty scripts in `tools/` directory. You need to do `npm install` before you can use them. They are mostly just for testing and development, but for the record:

`node tools/meta-validate.js`

Validates that `trivia-schema.json` itself conforms tp the JSON Schema spec.

`node tools/validate.js FILE`

Validates that `FILE` conforms to the trivia-schema spec.

`node tools/make-html.js INFILE OUTFILE`

Writes an html version of the questions contained in `INFILE` to `OUTFILE`. This currently doesn't implement all the details of the spec. In particular, it doesn't do multiple choice questions or implement any part of the annotation system.

# Feedback

Is this a useful thing? I don't know, but I'd like to think so. If you're in the non-negligible intersection of the set of trivia people and the set of computer people let me know what you think. 




