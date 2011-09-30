// this is a part of CodeMirror from sabaca / postmaster@codenodes.com
CodeMirror.defineMode("perl",function(config,parserConfig){

	function words(str){
		var obj={},words=str.split(" ");
		for(var i=0;i<words.length;++i)
			obj[words[i]]=true;
		return obj}

	function tokenSomething(quote,type,eatMore,eatAfter,eatBefore){
		return function(stream,state){
			var escaped=false,next,end=false;
			while((next=stream.next())!=null){
				if(next==quote&&!escaped){
					end=true;
					break}
				escaped=!escaped&&next=="\\"}
			if(end||!(escaped||multiLineStrings))
				state.tokenize=tokenBase;
			if(eatBefore)
				stream.eatWhile(eatBefore);
			if(eatAfter){
				escaped=false;
				end=false;
				while((next=stream.next())!=null){
					if(next==eatAfter&&!escaped){
						end=true;
						break}
					escaped=!escaped&&next=="\\"}}
			if(eatMore)
				stream.eatWhile(eatMore);
			return type=="regexp"?"number":type}}

	var indentUnit=config.indentUnit;
	var keywords=words("bootstrap new base constant continue else elsif for foreach format semctl shmctl shmget semget goto if last our local my next no package parent redo require scalar sub unless until while use const vars ARGV ENV INC SIG getprotobynumber getprotobyname getservbyname gethostbyaddr gethostbyname getservbyport getnetbyaddr getnetbyname getsockname getpeername setpriority getprotoent setprotoent getpriority endprotoent getservent setservent endservent sethostent socketpair getsockopt gethostent endhostent setsockopt setnetent quotemeta localtime prototype getnetent endnetent rewinddir wantarray getpwuid closedir getlogin readlink endgrent getgrgid getgrnam shmwrite shutdown readline endpwent setgrent readpipe formline truncate dbmclose syswrite setpwent getpwnam getgrent getpwent ucfirst sysread setpgrp shmread sysseek sysopen telldir defined opendir connect lcfirst getppid binmode syscall sprintf getpgrp readdir seekdir waitpid reverse unshift symlink dbmopen semget msgrcv rename listen chroot msgsnd shmctl accept unpack exists fileno shmget system unlink printf gmtime msgctl semctl values rindex substr splice length msgget select socket return caller delete alarm ioctl index undef lstat times srand chown fcntl close write umask rmdir study sleep chomp untie print utime mkdir atan2 split crypt flock chmod BEGIN bless unbless chdir semop shift reset link stat chop grep fork dump join open tell pipe exit glob warn each bind sort pack eval push keys getc kill seek sqrt send wait rand tied read time exec recv eof chr int ord exp pos pop sin log abs oct hex tie cos vec END ref map die uc lc do");
	var blockKeywords=words("if elsif else unless while do sub map BEGIN END PRINT PRINTF DESTROY TIE UNTIE READ");
	var atoms=words("sub undef or xor and not x eq ne cmp");
	var multiLineStrings=true;

	var hooks={
		"$":function(stream,state){
			if(stream.eatWhile(/[\w\$]/))
				return "meta"},
		"@":function(stream,state){
			if(stream.eatWhile(/[\w\$]/))
				return "meta"},
		"%":function(stream,state){
			if(stream.eatWhile(/[\w\$]/))
				return "meta"},
		"&":function(stream,state){
			if(stream.eatWhile(/[\w\$]/))
				return "meta"},
		":":function(stream,state){
			if(stream.eat(":"))
				return "meta"},
		"-":function(stream,state){
			if(stream.eat(">"))
				return "meta"},
		".":function(stream,state){
			if(stream.look()!=".")
				return "operator"},
		"q":function(stream,state){
			if(/[qwx]/.test(stream.look(0))){
				if(stream.look(1)=="("){
					stream.eat(/[qwx]/);
					stream.eat("(");
					state.tokenize=tokenSomething(")","string");
					return state.tokenize(stream,state)}
				if(stream.look(1)=="["){
					stream.eat(/[qwx]/);
					stream.eat("[");
					state.tokenize=tokenSomething("]","string");
					return state.tokenize(stream,state)}
				if(stream.look(1)=="{"){
					stream.eat(/[qwx]/);
					stream.eat("{");
					state.tokenize=tokenSomething("}","string");
					return state.tokenize(stream,state)}
				if(stream.look(1)=="<"){
					stream.eat(/[qwx]/);
					stream.eat("<");
					state.tokenize=tokenSomething(">","string");
					return state.tokenize(stream,state)}
				if(/[\^'"!~\/]/.test(stream.look(1))){
					stream.eat(/[qwx]/);
					state.tokenize=tokenSomething(stream.eat(/[\^'"!~\/]/),"string");
					return state.tokenize(stream,state)}}
			else if(stream.look(0)=="r"){
				if(stream.look(1)=="("){
					stream.eat("r");
					stream.eat("(");
					state.tokenize=tokenSomething(")","regexp",/[gosex]/);
					return state.tokenize(stream,state)}
				if(stream.look(1)=="["){
					stream.eat("r");
					stream.eat("[");
					state.tokenize=tokenSomething("]","regexp",/[gosex]/);
					return state.tokenize(stream,state)}
				if(stream.look(1)=="{"){
					stream.eat("r");
					stream.eat("{");
					state.tokenize=tokenSomething("}","regexp",/[gosex]/);
					return state.tokenize(stream,state)}
				if(stream.look(1)=="<"){
					stream.eat("r");
					stream.eat("<");
					state.tokenize=tokenSomething(">","regexp",/[gosex]/);
					return state.tokenize(stream,state)}
				if(/[\^'"!~\/]/.test(stream.look(1))){
					stream.eat("r");
					state.tokenize=tokenSomething(stream.eat(/[\^'"!~\/]/),"regexp",/[gosex]/);
					return state.tokenize(stream,state)}}},
		"m":function(stream,state){
			var c=stream.eat(/[(\[{<\^'"!~\/]/);
			if(!c)
				return;
			if(/[\^'"!~\/]/.test(c)){
				state.tokenize=tokenSomething(c,"regexp",/[gosex]/);
				return state.tokenize(stream,state)}
			if(c=="("){
				state.tokenize=tokenSomething(")","regexp",/[gosex]/);
				return state.tokenize(stream,state)}
			if(c=="["){
				state.tokenize=tokenSomething("]","regexp",/[gosex]/);
				return state.tokenize(stream,state)}
			if(c=="{"){
				state.tokenize=tokenSomething("}","regexp",/[gosex]/);
				return state.tokenize(stream,state)}
			if(c=="<"){
				state.tokenize=tokenSomething(">","regexp",/[gosex]/);
				return state.tokenize(stream,state)}},
		"s":function(stream,state){
			var c=stream.eat(/[(\[{<\^'"!~\/]/);
			if(!c)
				return;
			if(/[\^'"!~\/]/.test(c)){
				state.tokenize=tokenSomething(c,"regexp",/[gosex]/,c);
				return state.tokenize(stream,state)}
			if(c=="("){
				state.tokenize=tokenSomething(")","regexp",/[gosex]/,")","(");
				return state.tokenize(stream,state)}
			if(c=="["){
				state.tokenize=tokenSomething("]","regexp",/[gosex]/,"]","[");
				return state.tokenize(stream,state)}
			if(c=="{"){
				state.tokenize=tokenSomething("}","regexp",/[gosex]/,"}","{");
				return state.tokenize(stream,state)}
			if(c=="<"){
				state.tokenize=tokenSomething(">","regexp",/[gosex]/,">","<");
				return state.tokenize(stream,state)}},
		"/":function(stream,state){
			state.tokenize=tokenSomething("/","regexp",/[gosex]/);
			return state.tokenize(stream,state)},
		"#":function(stream,state){
			stream.skipToEnd();
			return "comment"}};

	var curPunc;

	function tokenBase(stream,state){
		var ch=stream.next();
		if(hooks[ch]){
			var result=hooks[ch](stream,state);
			if(result!==false)
				return result}
		if(ch=='"'||ch=="'"){
			state.tokenize=tokenString(ch);
			return state.tokenize(stream,state)}
		if(/[\[\]{}\(\),;]/.test(ch)){
			curPunc=ch;
			return null}
		if(/\d/.test(ch)){
			if(stream.eatWhile(/[\d_\.]/))
				return "number"}
		if(/\./.test(ch)){
			if(stream.eatWhile(/[\d_]/))
				return "number"}
		if(/[+\-*&%=<>!?|\/~\.]/.test(ch)){
			stream.eatWhile(ch);
			return "operator"}
		stream.eatWhile(/[\w\$]/);
		var cur=stream.current();
		if(keywords.propertyIsEnumerable(cur)){
			if(blockKeywords.propertyIsEnumerable(cur))
				curPunc="newstatement";
			return "keyword"}
		if(atoms.propertyIsEnumerable(cur))
			return "atom";
		return "word"}

	function tokenString(quote){
		return function(stream,state){
			var escaped=false,next,end=false;
			while((next=stream.next())!=null){
				if(next==quote&&!escaped){
					end=true;
					break}
				escaped=!escaped&&next=="\\"}
			if(end||!(escaped||multiLineStrings))
				state.tokenize=tokenBase;
			return "string"}}

	function tokenComment(stream,state){
		var maybeEnd=false,ch;
		while(ch=stream.next()){
			if(ch=="/"&&maybeEnd){
				state.tokenize=tokenBase;
				break}
			maybeEnd=ch=="*"}
		return "comment"}

	function Context(indented,column,type,align,prev){
		this.indented=indented;
		this.column=column;
		this.type=type;
		this.align=align;
		this.prev=prev}

	function pushContext(state,col,type){
		return state.context=new Context(state.indented,col,type,null,state.context)}

	function popContext(state){
		var t=state.context.type;
		if(t==")"||t=="]"||t=="}")
			state.indented = state.context.indented;
		return state.context=state.context.prev}

	return{
		startState:function(basecolumn){
			return{
				tokenize:null,
				context:new Context((basecolumn||0)-indentUnit,0,"top",false),
				indented:0,
				startOfLine:true}},
		token:function(stream,state){
			var ctx=state.context;
			if(stream.sol()){
				if(ctx.align==null)
					ctx.align=false;
				state.indented=stream.indentation();
				state.startOfLine=true}
			if(stream.eatSpace())
				return null;
			curPunc=null;
			var style=(state.tokenize||tokenBase)(stream,state);
			if(style=="comment"||style=="meta")
				return style;
			if(ctx.align==null)
				ctx.align=true;
			if((curPunc==";"||curPunc==":")&&ctx.type=="statement")
				popContext(state);
			else if(curPunc=="{")
				pushContext(state,stream.column(),"}");
			else if(curPunc=="[")
				pushContext(state,stream.column(),"]");
			else if(curPunc=="(")
				pushContext(state,stream.column(),")");
			else if(curPunc=="}"){
				while(ctx.type=="statement")
					ctx=popContext(state);
				if(ctx.type=="}")
					ctx=popContext(state);
				while(ctx.type=="statement")
					ctx=popContext(state)}
			else if(curPunc==ctx.type)
				popContext(state);
			else if(ctx.type=="}"||ctx.type=="top"||(ctx.type=="statement"&&curPunc=="newstatement"))
				pushContext(state,stream.column(),"statement");
			state.startOfLine=false;
			return style},
		indent:function(state,textAfter){
			if(state.tokenize!=tokenBase&&state.tokenize!=null)
				return 0;
			var firstChar=textAfter&&textAfter.charAt(0),ctx=state.context,closing=firstChar==ctx.type;
			if(ctx.type=="statement")
				return ctx.indented+(firstChar=="{"?0:indentUnit);
			else if(ctx.align)
				return ctx.column+(closing?0:1);
			else
				return ctx.indented+(closing?0:indentUnit)},
		electricChars:"{}"}});
CodeMirror.defineMIME("text/x-perl", "perl");

// it's like "peek", but need for look-ahead or look-behind if index < 0
CodeMirror.StringStream.prototype.look=function(index){
	return this.string.charAt(this.pos+(index||0))};
