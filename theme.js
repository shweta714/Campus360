;(function(){
	const PREF_KEY = 'campus360_prefs';
	function readPref(){ try{ const raw = localStorage.getItem(PREF_KEY); return raw ? JSON.parse(raw) : { theme: 'light' }; }catch(e){return { theme:'light' }; } }
		function applyThemeMode(mode){
			const dark = (mode === 'dark');
			try{
				// apply class to both html and body so pages using either selector get styled
				document.documentElement.classList.toggle('dark-theme', dark);
				if(document.body) document.body.classList.toggle('dark-theme', dark);
				// set data-theme attribute for alternate selector usage
				try{ document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light'); }catch(e){}
			}catch(e){}
		}
	// expose helper
	window.setTheme = function(mode){
		try{
			const prefs = readPref(); prefs.theme = mode; localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); applyThemeMode(mode);
			// notify other windows
			try{ window.dispatchEvent(new Event('themechange')); }catch(e){}
		}catch(e){}
	};
	// apply on load as early as possible
	try{
		const prefs = readPref(); applyThemeMode(prefs.theme || 'light');
	}catch(e){}
	// listen to storage changes so other tabs update immediately
	window.addEventListener('storage', function(e){ if(e.key === PREF_KEY){ try{ const val = JSON.parse(e.newValue || '{}'); applyThemeMode(val.theme || 'light'); }catch(err){} } });
})();

