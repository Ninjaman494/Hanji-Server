import java.text.Normalizer;
import java.util.Arrays;

public class Conjugator {

    private static final Syllable dictEnding = new Syllable("다");
    private static final char specialVerb = (char)4449;
    private static final Syllable yoEnding = new Syllable("요");
    private static final Syllable specialYo = new Syllable("아");
    private static final Syllable regularYo = new Syllable("어");

    public static Syllable[] deconstructWord(String word){
        Syllable[] syllables = new Syllable[word.length()];
        for(int i = 0; i < word.length(); i++){
            String s = ""+word.charAt(i);
            syllables[i] = new Syllable(s);
        }
        return syllables;
    }

    public static Syllable[] conjugateToYo(Syllable[] word){
        if(!word[word.length-1].equals(dictEnding)){
            return null;
        }
        Syllable[] stem = Arrays.copyOfRange(word, 0, word.length-1);
        char verb = stem[stem.length-1].getMiddle();
        if(verb == specialVerb){ // 아
            Syllable[] conjugatedWord = Arrays.copyOf(stem,stem.length+2);
            conjugatedWord[stem.length] = specialYo;
            conjugatedWord[stem.length+1] = yoEnding;
            return conjugatedWord;
        }else{ // 어
            Syllable[] conjugatedWord = Arrays.copyOf(stem,stem.length+2);
            conjugatedWord[stem.length] = regularYo;
            conjugatedWord[stem.length+1] = yoEnding;
            return conjugatedWord;
        }
        //return null;
    }

    public static void main(String[] args){
        Syllable syllable = new Syllable("해");
        String s = Normalizer.normalize(syllable.toString(), Normalizer.Form.NFD);
        System.out.println(syllable+": "+s.charAt(1)+"("+(int)s.charAt(1)+")");

        char i = s.charAt(0);
        char m = s.charAt(1);
        char e = s.charAt(2);
        System.out.println(""+i+m+e); // idk it just works

        String word ="없다";
        Syllable[] syllables = deconstructWord(word);

        System.out.print(word+": ");
        for(Syllable j: syllables) {
            System.out.print(j + " ");
        }
        for(Syllable j: syllables){
            System.out.print("\n"+j+": "+j.getInitial()+" "+j.getMiddle()+" "+j.getEnd());
        }
        System.out.println("");
        Syllable[] conjugated = conjugateToYo(syllables);
        for(Syllable j: conjugated) {
            System.out.print(j);
        }
    }
}