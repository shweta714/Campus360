;(function(){
	const PREF_KEY = 'campus360_prefs';
	function readPref(){ try{ const raw = localStorage.getItem(PREF_KEY); return raw ? JSON.parse(raw) : { theme: 'light' }; }catch(e){return { theme:'light' }; } }
		function applyThemeMode(mode){
			const dark = (mode === 'dark');
			try{
				document.documentElement.classList.toggle('dark-theme', dark);
				if(document.body) document.body.classList.toggle('dark-theme', dark);
				try{ document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light'); }catch(e){}
			}catch(e){}
		}
	window.setTheme = function(mode){
		try{
			const prefs = readPref(); prefs.theme = mode; localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); applyThemeMode(mode);
			try{ window.dispatchEvent(new Event('themechange')); }catch(e){}
		}catch(e){}
	};
	try{
		const prefs = readPref(); applyThemeMode(prefs.theme || 'light');
	}catch(e){}
	window.addEventListener('storage', function(e){ if(e.key === PREF_KEY){ try{ const val = JSON.parse(e.newValue || '{}'); applyThemeMode(val.theme || 'light'); }catch(err){} } });
})();
