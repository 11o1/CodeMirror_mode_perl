// hi. this is an alpha 0.03 (2011-10-01) of mode/perl.js (text/x-perl)
// this is a part of CodeMirror from sabaca / postmaster@codenodes.com
CodeMirror.defineMode("perl",function(config,parserConfig){

	function words(str){
		var obj={},words=str.split(" ");
		for(var i=0;i<words.length;i++)
			obj[words[i]]=true;
		return obj}

	function tokenSomething(quote,type,eatMore,eatAfter,eatBefore){
		return function(stream,state){
			var ql=quote.length;
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
	var blockKeywords=words("if elsif else unless while do sub map BEGIN END PRINT PRINTF DESTROY TIE DESTRUCT INIT RUN CHECK START CONSTRUCT UNTIE GETC");
	var atoms=words("ENV STDIN INC STDOUT ARGV STDERR ARGVOUT SIG bootstrap given new base constant getpid strict warnings warn getppid setregid argv prctl setgid setgroups getgid getgroups continue else elsif for foreach format semctl shmctl shmget semget my goto if last our local next no package parent redo require scalar sub unless until while use const vars ARGV ENV INC SIG getprotobynumber getprotobyname getservbyname gethostbyaddr gethostbyname getservbyport getnetbyaddr getnetbyname getsockname getpeername setpriority getprotoent setprotoent getpriority endprotoent getservent setservent endservent sethostent socketpair getsockopt gethostent endhostent setsockopt setnetent quotemeta localtime prototype getnetent endnetent rewinddir wantarray getpwuid closedir getlogin readlink endgrent getgrgid getgrnam shmwrite shutdown readline endpwent setgrent readpipe formline truncate dbmclose syswrite setpwent getpwnam getgrent getpwent ucfirst sysread setpgrp shmread sysseek sysopen telldir defined opendir connect lcfirst getppid binmode syscall sprintf getpgrp readdir seekdir waitpid reverse unshift symlink dbmopen semget msgrcv rename listen chroot msgsnd shmctl accept unpack exists fileno shmget system unlink printf gmtime msgctl semctl values rindex substr splice length msgget select socket return caller delete alarm ioctl index undef lstat times srand chown fcntl close write umask rmdir study sleep chomp untie print utime mkdir atan2 split crypt flock chmod BEGIN bless unbless chdir semop shift reset link stat chop grep fork dump join open tell pipe exit glob warn each bind sort pack eval push keys getc kill seek sqrt send wait rand tied read time exec recv eof chr int ord exp pos pop sin log abs oct hex tie cos vec ref map die uc lc do or xor and not x eq ne cmp");
	var multiLineStrings=true;

	var hooks={
		"$":function(stream,state){
			if(stream.eatWhile(/[\w\$\[\]]/))
				return "meta";
			return false},
		"@":function(stream,state){
			if(stream.eatWhile(/[\w\$\[\]]/))
				return "meta";
			return false},
		"%":function(stream,state){
			if(stream.eatWhile(/[\w\$]/))
				return "meta";
			return false},
		"&":function(stream,state){
			if(stream.eatWhile(/[\w\$]/))
				return "meta";
			return false},
		":":function(stream,state){
			if(stream.eat(":"))
				return "meta";
			return false},
		"-":function(stream,state){
			if(stream.eat(">"))
				return "meta";
			return false},
		"q":function(stream,state){
			var c=stream.look(-2);
			if(c&&/\w/.test(c))
				return false;
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
					return state.tokenize(stream,state)}}
			return false},
		"m":function(stream,state){
			var c=stream.look(-2);
			if(c&&/\w/.test(c))
				return false;
			c=stream.eat(/[(\[{<\^'"!~\/]/);
			if(!c)
				return false;
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
				return state.tokenize(stream,state)}
			return false},
		"s":function(stream,state){
			var c=stream.look(-2);
			if(c&&/\w/.test(c))
				return false;
			c=stream.eat(/[(\[{<\^'"!~\/]/);
			if(!c)
				return false;
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
				return state.tokenize(stream,state)}
			return false},
		"y":function(stream,state){
			var c=stream.look(-2);
			if(c&&/\w/.test(c))
				return false;
			c=stream.eat(/[(\[{<\^'"!~\/]/);
			if(!c)
				return false;
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
				return state.tokenize(stream,state)}
			return false},
		"t":function(stream,state){
			var c=stream.look(-2);
			if(c&&/\w/.test(c))
				return false;
			c=stream.eat("r");
			if(!c)
				return false;
			c=stream.eat(/[(\[{<\^'"!~\/]/);
			if(!c)
				return false;
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
				return state.tokenize(stream,state)}
			return false},
		"/":function(stream,state){
			state.tokenize=tokenSomething("/","regexp",/[gosex]/);
			return state.tokenize(stream,state)},
		"#":function(stream,state){
			stream.skipToEnd();
			return "comment"},
/*
		"<":function(stream,state){
			if(stream.look(0)=="<"&&stream.look(1)){
				var c=/^<\s*('(\w+)'|(\w+))/.exec(stream.suffix());
				if(c[1]){
					stream.eat("<");
					eval('stream.eatWhile(/[\s'+c[1]+']/)');
					c=c[2]||c[3];
					state.tokenize=tokenSomething(c,"string");
					return state.tokenize(stream,state)}}
			return false},
*/
		"_":function(stream,state){
			if(stream.pos==1&&stream.suffix(6)=="_END__"){
				state.tokenize=tokenSomething('\0',"comment");
				return state.tokenize(stream,state)}
			return false},
		"_":function(stream,state){
			if(stream.pos==1&&stream.suffix(7)=="_DATA__"){
				state.tokenize=tokenSomething('\0',"string");
				return state.tokenize(stream,state)}
			return false}};

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
		if(/\w/.test(ch)){
			var p=stream.pos;
			if(stream.look(-2)=="{"&&(stream.look(0)=="}"||stream.eatWhile(/\w/)&&stream.look(0)=="}"))
				return "string";
			else
				stream.pos=p}
		if(/[\[\]{}\(\);]/.test(ch)){
			curPunc=ch;
			return false}
		if(/\d/.test(ch)){
			stream.eatWhile(/[\d_\.]/);
			return "number"}
		if(ch=="."&&/[^\.\w]/.test(stream.look(-2))&&stream.eatWhile(/\d/)){
			return "number"}
		if(ch=="."){
			return "operator"}
		if(/[+\-\^*\$&%@=<>!?|\/~\.]/.test(ch)){
			stream.eatWhile(ch);
			return "operator"}
		if(/[A-Z]/.test(ch)){
			var l=stream.look(-2);
			var p=stream.pos;
			stream.eatWhile(/[A-Z_]/);
			if(/[\da-z]/.test(stream.look(0))){
				stream.pos=p}
			else{
				var cur=stream.current();
				if(blockKeywords.propertyIsEnumerable(cur))
					curPunc="newstatement";
				if(l!=":"){
					if(atoms.propertyIsEnumerable(cur))
						return "atom";
					else
						return "keyword"}
				else
					return "word"}}
		if(/[a-zA-Z_]/.test(ch)){
			var l=stream.look(-2);
			stream.eatWhile(/\w/);
			var cur=stream.current();
			if(blockKeywords.propertyIsEnumerable(cur))
				curPunc="newstatement";
			if(l!=":"){
				if(atoms.propertyIsEnumerable(cur))
					return "atom";
				else
					return "keyword"}
			else
				return "word"}
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
		multiLineStrings:true,
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

CodeMirror.StringStream.prototype.prefix=function(count){
	return this.string.substr((count?this.pos-count:0),this.pos+1)};

CodeMirror.StringStream.prototype.suffix=function(count){
	return this.string.substr(this.pos,(count||(this.string.length-this.pos+1)))};

CodeMirror.StringStream.prototype.nsuffix=function(count){
	var p=this.pos;
	var l=count||(this.string.length-this.pos+1);
	this.pos+=l;
	return this.string.substr(p,l)};
