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

    public static boolean isHangul(String korean){
        korean = korean.replace(" ","");
        for(int i=0;i<korean.length();i++){
            char c = korean.charAt(i);
            //System.out.println("char:"+c);
            if(!((int)c >= '가' && (int)c <= '힣')){
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args){
        System.out.println("하다: "+isHangul("하다"));
        System.out.println("어울리다: "+isHangul("어울리다"));
        System.out.println("나쁘다: "+isHangul("나쁘다"));
        System.out.println("학 거예요: " +isHangul("학 거예요"));
        System.out.println("가:"+isHangul("가"));
        System.out.println("힣: "+isHangul("힣"));
        System.out.println("Hi: "+isHangul("Hi"));
        System.out.println("I like big butts: "+isHangul("I like big butts"));
        System.out.println("supercalifragilisticexpialidocious: "+isHangul("supercalifragilisticexpialidocious"));
        System.out.println("おはようございます:"+isHangul("おはようございます"));

    }
}